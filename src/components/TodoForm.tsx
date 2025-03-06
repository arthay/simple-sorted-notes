
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TodoFormProps {
  onAddTodo: (text: string, priority: 'low' | 'medium' | 'high') => void;
}

const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text.trim(), priority);
      setText('');
      setPriority('medium');
      setIsExpanded(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8 transition-all-fast glass-morphism animate-scale-in",
        isExpanded ? "sm:p-6" : ""
      )}
    >
      <div className="space-y-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Add a new task..."
          className="w-full px-4 py-3 rounded-lg border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary bg-transparent"
          aria-label="Task description"
        />
        
        {isExpanded && (
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center animate-fade-in">
            <div className="flex flex-col space-y-1 sm:w-1/3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary py-1.5 px-3 bg-transparent"
                aria-label="Task priority"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={!text.trim()}
              className={cn(
                "mt-3 sm:mt-auto py-2 px-4 rounded-lg font-medium transition-all-fast hover-scale",
                text.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
              )}
            >
              Add Task
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
