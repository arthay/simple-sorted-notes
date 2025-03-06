
// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const todoList = document.getElementById('todoList');
const formExpanded = document.getElementById('formExpanded');
const addButton = document.getElementById('addButton');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const priorityFilter = document.getElementById('priorityFilter');
const sortBy = document.getElementById('sortBy');
const pagination = document.getElementById('pagination');
const stats = document.getElementById('stats');
const emptyState = document.getElementById('emptyState');
const emptyStateSubtext = document.getElementById('emptyStateSubtext');

// Constants
const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let draggedItem = null;

// Initialize sample todos if localStorage is empty
let todos = JSON.parse(localStorage.getItem('todos')) || [
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

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Generate a unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Add a new todo
function addTodo(text, priority) {
  const newTodo = {
    id: generateId(),
    text,
    completed: false,
    priority,
    createdAt: new Date().toISOString()
  };
  
  todos.unshift(newTodo);
  saveTodos();
  renderTodos();
  
  // Reset form
  todoInput.value = '';
  prioritySelect.value = 'medium';
  addButton.disabled = true;
  
  // Reset to first page if necessary
  if (currentPage !== 1) {
    currentPage = 1;
    renderPagination();
  }
}

// Toggle todo completion status
function toggleTodo(id) {
  todos = todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  
  saveTodos();
  renderTodos();
  updateStats();
}

// Delete a todo
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  
  const filteredTodos = getFilteredAndSortedTodos();
  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  
  // Adjust current page if needed after deletion
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }
  
  renderTodos();
  renderPagination();
  updateStats();
}

// Filter and sort todos
function getFilteredAndSortedTodos() {
  const searchQuery = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  const priority = priorityFilter.value;
  const sort = sortBy.value;
  
  return todos
    .filter(todo => {
      // Status filter
      if (status === 'active' && todo.completed) return false;
      if (status === 'completed' && !todo.completed) return false;
      
      // Priority filter
      if (priority !== 'all' && todo.priority !== priority) return false;
      
      // Search query
      if (searchQuery && !todo.text.toLowerCase().includes(searchQuery)) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sort === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sort === 'priority') {
        const priorityValue = { low: 1, medium: 2, high: 3 };
        return priorityValue[b.priority] - priorityValue[a.priority];
      } else if (sort === 'alphabetical') {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });
}

// Render todos to the DOM
function renderTodos() {
  const filteredAndSortedTodos = getFilteredAndSortedTodos();
  
  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTodos = filteredAndSortedTodos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Clear current todos
  todoList.innerHTML = '';
  
  // Show empty state if no todos match filters
  if (filteredAndSortedTodos.length === 0) {
    emptyState.classList.remove('hidden');
    const hasFilters = searchInput.value || statusFilter.value !== 'all' || priorityFilter.value !== 'all';
    emptyStateSubtext.textContent = hasFilters ? 'Try changing your filters' : 'Add a task to get started';
  } else {
    emptyState.classList.add('hidden');
    
    // Render todos
    paginatedTodos.forEach(todo => {
      const row = document.createElement('tr');
      row.className = `todo-row todo-row-${todo.priority}`;
      row.dataset.id = todo.id;
      if (todo.completed) row.classList.add('completed');
      
      row.innerHTML = `
        <td>
          <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        </td>
        <td>${todo.text}</td>
        <td>
          <span class="priority-badge priority-badge-${todo.priority}">
            ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </span>
        </td>
        <td>
          <span class="todo-date">${formatDate(todo.createdAt)}</span>
        </td>
        <td>
          <button class="delete-btn" aria-label="Delete todo">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </td>
      `;
      
      // Event listeners
      const checkbox = row.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', () => toggleTodo(todo.id));
      
      const deleteBtn = row.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTodo(todo.id);
      });
      
      // Drag and Drop Functionality
      row.draggable = true;
      
      row.addEventListener('dragstart', function(e) {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);
      });
      
      row.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        draggedItem = null;
      });
      
      row.addEventListener('dragover', function(e) {
        e.preventDefault();
        if (draggedItem !== this) {
          this.classList.add('drag-over');
        }
      });
      
      row.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
      });
      
      row.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (draggedItem !== this) {
          // Get indices in the current page
          const currentPageIds = paginatedTodos.map(todo => todo.id);
          const fromIndex = currentPageIds.indexOf(draggedItem.dataset.id);
          const toIndex = currentPageIds.indexOf(this.dataset.id);
          
          // Get the absolute indices in the filtered array
          const filteredIds = filteredAndSortedTodos.map(todo => todo.id);
          const absoluteFromIndex = filteredIds.indexOf(draggedItem.dataset.id);
          const absoluteToIndex = filteredIds.indexOf(this.dataset.id);
          
          // Get the actual todo objects
          const fromTodo = filteredAndSortedTodos[absoluteFromIndex];
          const toTodo = filteredAndSortedTodos[absoluteToIndex];
          
          // Find positions in the original todos array
          const origFromIndex = todos.findIndex(todo => todo.id === fromTodo.id);
          const origToIndex = todos.findIndex(todo => todo.id === toTodo.id);
          
          // Reorder in the original todos array
          const [removed] = todos.splice(origFromIndex, 1);
          todos.splice(origToIndex, 0, removed);
          
          saveTodos();
          renderTodos();
        }
      });
      
      todoList.appendChild(row);
    });
  }
  
  renderPagination();
  updateStats();
}

// Render pagination controls
function renderPagination() {
  const filteredTodos = getFilteredAndSortedTodos();
  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  
  pagination.innerHTML = '';
  
  if (totalPages <= 1) return;
  
  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
  prevBtn.textContent = '←';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTodos();
    }
  });
  pagination.appendChild(prevBtn);
  
  // Page buttons
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderTodos();
    });
    pagination.appendChild(pageBtn);
  }
  
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
  nextBtn.textContent = '→';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTodos();
    }
  });
  pagination.appendChild(nextBtn);
}

// Update stats
function updateStats() {
  if (todos.length === 0) {
    stats.textContent = '';
    return;
  }
  
  const completedCount = todos.filter(todo => todo.completed).length;
  stats.textContent = `${completedCount} completed / ${todos.length} total tasks`;
}

// Event listeners
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  const priority = prioritySelect.value;
  
  if (text) {
    addTodo(text, priority);
  }
});

todoInput.addEventListener('input', () => {
  if (todoInput.value.trim()) {
    formExpanded.classList.add('show');
    addButton.disabled = false;
  } else {
    addButton.disabled = true;
  }
});

todoInput.addEventListener('focus', () => {
  formExpanded.classList.add('show');
});

// Filter and search event listeners
searchInput.addEventListener('input', () => {
  currentPage = 1;
  renderTodos();
});

statusFilter.addEventListener('change', () => {
  currentPage = 1;
  renderTodos();
});

priorityFilter.addEventListener('change', () => {
  currentPage = 1;
  renderTodos();
});

sortBy.addEventListener('change', () => {
  currentPage = 1;
  renderTodos();
});

// Initialize the app
renderTodos();
