
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TodoItem from '@/components/TodoItem';
import TodoForm from '@/components/TodoForm';
import TodoFilter from '@/components/TodoFilter';
import TodoPagination from '@/components/TodoPagination';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const ITEMS_PER_PAGE = 5;

const Index = () => {
  // Initialize with sample data
  const [todos, setTodos] = useState<Todo[]>(() => {
    const initialTodos = [
      { 
        id: uuidv4(), 
        text: 'Complete project proposal', 
        completed: false, 
        priority: 'high' as const, 
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) 
      },
      { 
        id: uuidv4(), 
        text: 'Schedule team meeting', 
        completed: true, 
        priority: 'medium' as const, 
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) 
      },
      { 
        id: uuidv4(), 
        text: 'Review design mockups', 
        completed: false, 
        priority: 'medium' as const, 
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) 
      },
      { 
        id: uuidv4(), 
        text: 'Update documentation', 
        completed: false, 
        priority: 'low' as const, 
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000) 
      },
      { 
        id: uuidv4(), 
        text: 'Prepare presentation slides', 
        completed: false, 
        priority: 'high' as const, 
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000) 
      },
      { 
        id: uuidv4(), 
        text: 'Send weekly report', 
        completed: true, 
        priority: 'medium' as const, 
        createdAt: new Date(Date.now() - 60 * 60 * 1000) 
      },
      { 
        id: uuidv4(), 
        text: 'Set up development environment', 
        completed: true, 
        priority: 'low' as const, 
        createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000) 
      },
    ];
    
    // Check for saved todos
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : initialTodos;
  });

  // Filters and sort state
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Save todos to localStorage when they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, sortBy, searchQuery]);

  // Add a new todo
  const handleAddTodo = (text: string, priority: 'low' | 'medium' | 'high') => {
    const newTodo = {
      id: uuidv4(),
      text,
      completed: false,
      priority,
      createdAt: new Date(),
    };
    
    setTodos([newTodo, ...todos]);
  };

  // Toggle a todo's completed status
  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Filter and sort todos
  const getFilteredAndSortedTodos = () => {
    return todos
      .filter((todo) => {
        // Status filter
        if (statusFilter === 'active' && todo.completed) return false;
        if (statusFilter === 'completed' && !todo.completed) return false;
        
        // Priority filter
        if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
        
        // Search query
        if (searchQuery && !todo.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        
        return true;
      })
      .sort((a, b) => {
        // Sort by selected criteria
        if (sortBy === 'date') {
          return (new Date(b.createdAt).getTime()) - (new Date(a.createdAt).getTime());
        } else if (sortBy === 'priority') {
          const priorityValue = { low: 1, medium: 2, high: 3 };
          return priorityValue[b.priority] - priorityValue[a.priority];
        } else if (sortBy === 'alphabetical') {
          return a.text.localeCompare(b.text);
        }
        return 0;
      });
  };

  const filteredAndSortedTodos = getFilteredAndSortedTodos();
  
  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTodos.length / ITEMS_PER_PAGE);
  const currentTodos = filteredAndSortedTodos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Format date for display
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-10">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
            Minimalist Todo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay organized with elegance and simplicity
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-6 animate-slide-right">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full px-4 py-3 pl-10 rounded-lg border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>
        
        {/* Todo form */}
        <TodoForm onAddTodo={handleAddTodo} />
        
        {/* Filters */}
        <TodoFilter
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          sortBy={sortBy}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onSortChange={setSortBy}
        />
        
        {/* Todo list */}
        <div className="space-y-1">
          {currentTodos.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? "Try changing your filters" 
                  : "Add a task to get started"}
              </p>
            </div>
          ) : (
            currentTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                priority={todo.priority}
                date={formatDate(todo.createdAt)}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
        
        {/* Pagination */}
        <TodoPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        
        {/* Stats */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
          {todos.length > 0 && (
            <p>
              {todos.filter(t => t.completed).length} completed / {todos.length} total tasks
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
