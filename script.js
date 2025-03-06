// Global variables
let todos = [];
let filteredTodos = [];
let currentPage = 1;
const itemsPerPage = 5;
let dragStartIndex;

// DOM elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');
const sortBy = document.getElementById('sortBy');
const searchInput = document.getElementById('searchInput');
const formExpanded = document.getElementById('formExpanded');
const pagination = document.getElementById('pagination');
const stats = document.getElementById('stats');

// Initialize the app
function init() {
  // Load todos from localStorage
  const storedTodos = localStorage.getItem('todos');
  
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
  } else {
    // Sample data if no todos exist
    todos = [
      { id: generateId(), text: 'Complete project proposal', completed: false, priority: 'high', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { id: generateId(), text: 'Schedule team meeting', completed: true, priority: 'medium', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      { id: generateId(), text: 'Review design mockups', completed: false, priority: 'medium', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
      { id: generateId(), text: 'Update documentation', completed: false, priority: 'low', createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
      { id: generateId(), text: 'Prepare presentation slides', completed: false, priority: 'high', createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
      { id: generateId(), text: 'Send weekly report', completed: true, priority: 'medium', createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      { id: generateId(), text: 'Set up development environment', completed: true, priority: 'low', createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString() }
    ];
    saveTodos();
  }
  
  // Setup event listeners
  setupEventListeners();
  
  // Render todos
  filterAndRenderTodos();
}

// Set up event listeners
function setupEventListeners() {
  // Form submission
  todoForm.addEventListener('submit', handleFormSubmit);
  
  // Form controls
  todoInput.addEventListener('input', toggleAddButton);
  todoInput.addEventListener('focus', expandForm);
  
  // Filters change
  statusFilter.addEventListener('change', handleFiltersChange);
  priorityFilter.addEventListener('change', handleFiltersChange);
  sortBy.addEventListener('change', handleFiltersChange);
  searchInput.addEventListener('input', handleFiltersChange);
}

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Toggle add button based on input value
function toggleAddButton() {
  addButton.disabled = !todoInput.value.trim();
}

// Expand the form when input is focused
function expandForm() {
  formExpanded.classList.add('show');
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  const text = todoInput.value.trim();
  
  if (!text) return;
  
  // Create new todo object
  const newTodo = {
    id: generateId(),
    text,
    completed: false,
    priority: prioritySelect.value,
    createdAt: new Date().toISOString()
  };
  
  // Add to todos array
  todos.unshift(newTodo);
  
  // Save and render
  saveTodos();
  filterAndRenderTodos();
  
  // Reset form
  todoInput.value = '';
  prioritySelect.value = 'medium';
  toggleAddButton();
}

// Handle filter changes
function handleFiltersChange() {
  currentPage = 1; // Reset to first page when filters change
  filterAndRenderTodos();
}

// Filter, sort, and render todos
function filterAndRenderTodos() {
  const statusValue = statusFilter.value;
  const priorityValue = priorityFilter.value;
  const sortValue = sortBy.value;
  const searchValue = searchInput.value.toLowerCase();
  
  // Filter todos
  filteredTodos = todos.filter(todo => {
    // Status filter
    if (statusValue === 'active' && todo.completed) return false;
    if (statusValue === 'completed' && !todo.completed) return false;
    
    // Priority filter
    if (priorityValue !== 'all' && todo.priority !== priorityValue) return false;
    
    // Search filter
    if (searchValue && !todo.text.toLowerCase().includes(searchValue)) return false;
    
    return true;
  });
  
  // Sort todos
  filteredTodos.sort((a, b) => {
    if (sortValue === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortValue === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    } else if (sortValue === 'alphabetical') {
      return a.text.localeCompare(b.text);
    }
    return 0;
  });
  
  // Render the filtered and sorted todos
  renderTodos();
  renderPagination();
  renderStats();
}

// Render todos
function renderTodos() {
  todoList.innerHTML = '';
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTodos = filteredTodos.slice(startIndex, startIndex + itemsPerPage);
  
  if (paginatedTodos.length === 0) {
    // Show empty state
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    const emptyStateIcon = document.createElement('div');
    emptyStateIcon.className = 'empty-state-icon';
    emptyStateIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    
    const emptyStateText = document.createElement('p');
    emptyStateText.className = 'empty-state-text';
    emptyStateText.textContent = 'No tasks found';
    
    const emptyStateSubtext = document.createElement('p');
    emptyStateSubtext.className = 'empty-state-subtext';
    
    if (searchInput.value || statusFilter.value !== 'all' || priorityFilter.value !== 'all') {
      emptyStateSubtext.textContent = 'Try changing your filters';
    } else {
      emptyStateSubtext.textContent = 'Add a task to get started';
    }
    
    emptyState.appendChild(emptyStateIcon);
    emptyState.appendChild(emptyStateText);
    emptyState.appendChild(emptyStateSubtext);
    
    todoList.appendChild(emptyState);
  } else {
    // Create todo items
    paginatedTodos.forEach((todo, index) => {
      const todoItem = createTodoItem(todo, index);
      todoList.appendChild(todoItem);
    });
  }
}

// Create a todo item
function createTodoItem(todo, index) {
  const todoItem = document.createElement('div');
  todoItem.className = `todo-item todo-item-${todo.priority} ${todo.completed ? 'completed' : ''}`;
  todoItem.setAttribute('data-id', todo.id);
  todoItem.setAttribute('draggable', 'true');
  
  // Add drag and drop event listeners
  todoItem.addEventListener('dragstart', dragStart);
  todoItem.addEventListener('dragover', dragOver);
  todoItem.addEventListener('drop', dragDrop);
  todoItem.addEventListener('dragenter', dragEnter);
  todoItem.addEventListener('dragleave', dragLeave);
  
  const todoItemContent = document.createElement('div');
  todoItemContent.className = 'todo-item-content';
  
  const todoItemLeft = document.createElement('div');
  todoItemLeft.className = 'todo-item-left';
  
  const todoCheckbox = document.createElement('input');
  todoCheckbox.className = 'todo-checkbox';
  todoCheckbox.type = 'checkbox';
  todoCheckbox.checked = todo.completed;
  todoCheckbox.addEventListener('change', () => toggleTodoComplete(todo.id));
  
  const todoTextContainer = document.createElement('div');
  todoTextContainer.className = 'todo-text-container';
  
  const todoTextRow = document.createElement('div');
  todoTextRow.className = 'todo-text-row';
  
  const todoText = document.createElement('span');
  todoText.className = 'todo-text';
  todoText.textContent = todo.text;
  
  const priorityBadge = document.createElement('span');
  priorityBadge.className = `priority-badge priority-badge-${todo.priority}`;
  priorityBadge.textContent = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);
  
  const todoDate = document.createElement('span');
  todoDate.className = 'todo-date';
  todoDate.textContent = formatDate(todo.createdAt);
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
  
  todoTextRow.appendChild(todoText);
  todoTextRow.appendChild(priorityBadge);
  
  todoTextContainer.appendChild(todoTextRow);
  todoTextContainer.appendChild(todoDate);
  
  todoItemLeft.appendChild(todoCheckbox);
  todoItemLeft.appendChild(todoTextContainer);
  
  todoItemContent.appendChild(todoItemLeft);
  todoItemContent.appendChild(deleteBtn);
  
  todoItem.appendChild(todoItemContent);
  
  return todoItem;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  // If less than 24 hours, show relative time
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (hours < 1) {
      const minutes = Math.floor(diff / (60 * 1000));
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    }
    return `${hours}h ago`;
  }
  
  // Otherwise show formatted date
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}

// Toggle todo complete status
function toggleTodoComplete(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  
  saveTodos();
  filterAndRenderTodos();
}

// Delete todo
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  
  saveTodos();
  filterAndRenderTodos();
}

// Render pagination
function renderPagination() {
  pagination.innerHTML = '';
  
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  
  if (totalPages <= 1) return;
  
  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
  prevBtn.textContent = '←';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      filterAndRenderTodos();
    }
  });
  
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
  nextBtn.textContent = '→';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      filterAndRenderTodos();
    }
  });
  
  // Page buttons
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  
  pagination.appendChild(prevBtn);
  
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      filterAndRenderTodos();
    });
    
    pagination.appendChild(pageBtn);
  }
  
  pagination.appendChild(nextBtn);
}

// Render stats
function renderStats() {
  stats.innerHTML = '';
  
  if (todos.length === 0) return;
  
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  
  stats.textContent = `${completedCount} completed / ${totalCount} total tasks`;
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Drag and drop functionality
function dragStart(e) {
  const todoItem = e.target.closest('.todo-item');
  dragStartIndex = Array.from(todoList.querySelectorAll('.todo-item')).indexOf(todoItem);
  
  setTimeout(() => {
    todoItem.classList.add('dragging');
  }, 0);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add('drag-over');
}

function dragLeave() {
  this.classList.remove('drag-over');
}

function dragDrop(e) {
  const dragEndIndex = Array.from(todoList.querySelectorAll('.todo-item')).indexOf(this);
  this.classList.remove('drag-over');
  
  // Calculate the actual indices in the filtered todos array
  const startIndex = (currentPage - 1) * itemsPerPage + dragStartIndex;
  const endIndex = (currentPage - 1) * itemsPerPage + dragEndIndex;

  if (startIndex === endIndex) return;

  // Reorder todos only within the current filtered subset
  const [reorderedItem] = filteredTodos.splice(startIndex, 1);
  filteredTodos.splice(endIndex, 0, reorderedItem);
  
  // Update the original todos array based on the new filtered order
  const todoIds = new Set(filteredTodos.map(t => t.id));
  const otherTodos = todos.filter(t => !todoIds.has(t.id));
  todos = [...filteredTodos, ...otherTodos];
  
  // Save and re-render
  saveTodos();
  renderTodos();
  
  // Remove dragging class from all items
  document.querySelectorAll('.todo-item').forEach(item => {
    item.classList.remove('dragging');
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
