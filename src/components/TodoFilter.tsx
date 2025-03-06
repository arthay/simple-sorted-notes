
import React from 'react';

interface TodoFilterProps {
  statusFilter: string;
  priorityFilter: string;
  sortBy: string;
  onStatusFilterChange: (value: string) => void;
  onPriorityFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const TodoFilter = ({
  statusFilter,
  priorityFilter,
  sortBy,
  onStatusFilterChange,
  onPriorityFilterChange,
  onSortChange
}: TodoFilterProps) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6 animate-fade-in">
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary py-1.5 px-3 bg-transparent"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary py-1.5 px-3 bg-transparent"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary py-1.5 px-3 bg-transparent"
        >
          <option value="date">Date Added</option>
          <option value="priority">Priority</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
    </div>
  );
};

export default TodoFilter;
