import React from 'react';
import { Table2, Columns } from 'lucide-react';

interface ViewToggleProps {
  view: 'table' | 'document';
  onViewChange: (view: 'table' | 'document') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-dark-600">
      <button
        onClick={() => onViewChange('document')}
        className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 ${
          view === 'document'
            ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
            : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
        }`}
      >
        <Columns className="w-4 h-4" />
        Document View
      </button>
      <button
        onClick={() => onViewChange('table')}
        className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 ${
          view === 'table'
            ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
            : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
        }`}
      >
        <Table2 className="w-4 h-4" />
        Table View
      </button>
    </div>
  );
}