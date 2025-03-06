
// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const addButton = document.getElementById('addButton');
const formExpanded = document.getElementById('formExpanded');
const todoList = document.getElementById('todoList');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');
const sortBySelect = document.getElementById('sortBy');
const searchInput = document.getElementById('searchInput');
const paginationElement = document.getElementById('pagination');
const statsElement = document.getElementById('stats');

// Constants
const ITEMS_PER_PAGE = 5;

// State
let todos = [];
let currentPage = 1;
let statusFilterValue = 'all';
let priorityFilterValue = 'all';
let sortByValue = 'date';
let searchQuery = '';

// Initialize with sample data
function initializeApp() {
  const savedTodos = localStorage.getItem('todos');
  
  if (savedTodos) {
    todos = JSON.parse(savedTodos);
  } else {
    // Sample data
    todos = [
      { 
        id: generateId(), 
        text: 'Complete project proposal', 
        completed: false, 
        priority: 'high', 
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      { 
        id: generateId(), 
        text: 'Schedule team meeting', 
        completed: true, 
        priority: 'medium', 
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      },
      { 
        id: generateId(), 
        text: 'Review design mockups', 
        completed: false, 
        priority: 'medium', 
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      { 
        id: generateId(), 
        text: 'Update documentation', 
        completed: false, 
        priority: 'low', 
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
      },
      { 
        id: generateId(), 
        text: 'Prepare presentation slides', 
        completed: false, 
        priority: 'high', 
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
      },
      { 
        id: generateId(), 
        text: 'Send weekly report', 
        completed: true, 
        priority: 'medium', 
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      { 
        id: generateId(), 
        text: 'Set up development environment', 
        completed: true, 
        priority: 'low', 
        createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
      },
    ];
    saveTodos();
  }
  
  renderTodos();
  renderStats();

  // Setup event listeners
  setupEventListeners();
}

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Set up all event listeners
function setupEventListeners() {
  // Form events
  todoInput.addEventListener('input', toggleAddButton);
  todoInput.addEventListener('focus', expandForm);
  todoForm.addEventListener('submit', addTodo);
  
  // Filter events
  statusFilter.addEventListener('change', updateFilters);
  priorityFilter.addEventListener('change', updateFilters);
  sortBySelect.addEventListener('change', updateFilters);
  searchInput.addEventListener('input', updateFilters);
}

// Expand form when the input is focused
function expandForm() {
  formExpanded.classList.add('show');
}

// Toggle add button based on input
function toggleAddButton() {
  addButton.disabled = !todoInput.value.trim();
}

// Update filters and re-render
function updateFilters() {
  statusFilterValue = statusFilter.value;
  priorityFilterValue = priorityFilter.value;
  sortByValue = sortBySelect.value;
  searchQuery = searchInput.value.toLowerCase();
  currentPage = 1;
  renderTodos();
}

// Add a new todo
function addTodo(e) {
  e.preventDefault();
  
  const text = todoInput.value.trim();
  if (!text) return;
  
  const newTodo = {
    id: generateId(),
    text,
    completed: false,
    priority: prioritySelect.value,
    createdAt: new Date().toISOString()
  };
  
  todos.unshift(newTodo);
  saveTodos();
  
  // Reset form
  todoInput.value = '';
  prioritySelect.value = 'medium';
  formExpanded.classList.remove('show');
  addButton.disabled = true;
  
  renderTodos();
  renderStats();
}

// Toggle a todo's completed status
function toggleTodo(id) {
  todos = todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  
  saveTodos();
  renderTodos();
  renderStats();
}

// Delete a todo
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
  renderStats();
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Filter and sort todos
function getFilteredAndSortedTodos() {
  return todos
    .filter(todo => {
      // Status filter
      if (statusFilterValue === 'active' && todo.completed) return false;
      if (statusFilterValue === 'completed' && !todo.completed) return false;
      
      // Priority filter
      if (priorityFilterValue !== 'all' && todo.priority !== priorityFilterValue) return false;
      
      // Search query
      if (searchQuery && !todo.text.toLowerCase().includes(searchQuery)) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortByValue === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortByValue === 'priority') {
        const priorityValue = { low: 1, medium: 2, high: 3 };
        return priorityValue[b.priority] - priorityValue[a.priority];
      } else if (sortByValue === 'alphabetical') {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });
}

// Render the filtered and sorted todos
function renderTodos() {
  const filteredAndSortedTodos = getFilteredAndSortedTodos();
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedTodos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTodos = filteredAndSortedTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Clear the list
  todoList.innerHTML = '';
  
  // If no todos match filters, show empty state
  if (currentTodos.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'empty-state-icon';
    iconDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    
    const textP = document.createElement('p');
    textP.className = 'empty-state-text';
    textP.textContent = 'No tasks found';
    
    const subtextP = document.createElement('p');
    subtextP.className = 'empty-state-subtext';
    subtextP.textContent = searchQuery || statusFilterValue !== 'all' || priorityFilterValue !== 'all'
      ? 'Try changing your filters'
      : 'Add a task to get started';
    
    emptyState.appendChild(iconDiv);
    emptyState.appendChild(textP);
    emptyState.appendChild(subtextP);
    
    todoList.appendChild(emptyState);
  } else {
    // Render todos
    currentTodos.forEach(todo => {
      const todoItem = document.createElement('div');
      todoItem.className = `todo-item todo-item-${todo.priority} ${todo.completed ? 'completed' : ''}`;
      todoItem.dataset.id = todo.id;
      
      const todoContent = document.createElement('div');
      todoContent.className = 'todo-item-content';
      
      // Left side with checkbox and text
      const todoLeft = document.createElement('div');
      todoLeft.className = 'todo-item-left';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => toggleTodo(todo.id));
      
      const textContainer = document.createElement('div');
      textContainer.className = 'todo-text-container';
      
      const textRow = document.createElement('div');
      textRow.className = 'todo-text-row';
      
      const text = document.createElement('span');
      text.className = 'todo-text';
      text.textContent = todo.text;
      
      const priorityBadge = document.createElement('span');
      priorityBadge.className = `priority-badge priority-badge-${todo.priority}`;
      priorityBadge.textContent = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);
      
      const date = document.createElement('p');
      date.className = 'todo-date';
      date.textContent = formatDate(new Date(todo.createdAt));
      
      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.setAttribute('aria-label', 'Delete todo');
      deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
      deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
      
      // Assemble the todo item
      textRow.appendChild(text);
      textRow.appendChild(priorityBadge);
      textContainer.appendChild(textRow);
      textContainer.appendChild(date);
      
      todoLeft.appendChild(checkbox);
      todoLeft.appendChild(textContainer);
      
      todoContent.appendChild(todoLeft);
      todoContent.appendChild(deleteBtn);
      
      todoItem.appendChild(todoContent);
      todoList.appendChild(todoItem);
    });
  }
  
  // Render pagination
  renderPagination(totalPages);
}

// Render pagination controls
function renderPagination(totalPages) {
  paginationElement.innerHTML = '';
  
  if (totalPages <= 1) return;
  
  // Create pagination controls
  const prevButton = document.createElement('button');
  prevButton.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
  prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  prevButton.setAttribute('aria-label', 'Previous page');
  
  if (currentPage > 1) {
    prevButton.addEventListener('click', () => {
      currentPage--;
      renderTodos();
    });
  }
  
  paginationElement.appendChild(prevButton);
  
  // Generate page numbers
  const pageNumbers = [];
  
  if (totalPages <= 5) {
    // If 5 or fewer pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate middle pages
    if (currentPage <= 3) {
      pageNumbers.push(2, 3, 4);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
    }
    
    // Always show last page
    if (!pageNumbers.includes(totalPages)) {
      if (!pageNumbers.includes(totalPages - 1)) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    
    // Add ellipsis after first page if needed
    if (pageNumbers[1] !== 2 && pageNumbers[1] !== '...') {
      pageNumbers.splice(1, 0, '...');
    }
  }
  
  // Create page buttons
  pageNumbers.forEach(page => {
    const pageButton = document.createElement('button');
    pageButton.className = `pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`;
    pageButton.textContent = page;
    
    if (page !== '...' && page !== currentPage) {
      pageButton.addEventListener('click', () => {
        currentPage = page;
        renderTodos();
      });
    }
    
    paginationElement.appendChild(pageButton);
  });
  
  // Next button
  const nextButton = document.createElement('button');
  nextButton.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
  nextButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
  nextButton.setAttribute('aria-label', 'Next page');
  
  if (currentPage < totalPages) {
    nextButton.addEventListener('click', () => {
      currentPage++;
      renderTodos();
    });
  }
  
  paginationElement.appendChild(nextButton);
}

// Render stats
function renderStats() {
  if (todos.length === 0) {
    statsElement.textContent = '';
    return;
  }
  
  const completedCount = todos.filter(todo => todo.completed).length;
  statsElement.textContent = `${completedCount} completed / ${todos.length} total tasks`;
}

// Format date
function formatDate(date) {
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}

// Start the app
document.addEventListener('DOMContentLoaded', initializeApp);
