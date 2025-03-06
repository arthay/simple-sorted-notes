
import React from 'react';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  date: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ 
  id, 
  text, 
  completed, 
  priority,
  date,
  onToggle, 
  onDelete 
}: TodoItemProps) => {
  const priorityClasses = {
    low: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900',
    medium: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900',
    high: 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900',
  };

  const priorityLabel = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  };

  const priorityBadgeClasses = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    high: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  };

  return (
    <div 
      className={cn(
        "relative rounded-lg p-4 mb-3 border hover-scale animate-fade-in",
        priorityClasses[priority],
        completed && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggle(id)}
            className="w-5 h-5 rounded-full border-2 checked:bg-primary checked:border-primary"
          />
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span 
                className={cn(
                  "text-base font-medium transition-all-fast",
                  completed && "line-through text-gray-500 dark:text-gray-400"
                )}
              >
                {text}
              </span>
              <span 
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  priorityBadgeClasses[priority]
                )}
              >
                {priorityLabel[priority]}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="text-gray-400 hover:text-destructive transition-colors duration-200"
          aria-label="Delete todo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
