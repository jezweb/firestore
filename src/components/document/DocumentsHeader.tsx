import React from 'react';
import { Plus, ListChecks, Download, Trash2 } from 'lucide-react';

interface DocumentsHeaderProps {
  documentsCount: number;
  selectedCount: number;
  filtersCount: number;
  showBatchUpdate: boolean;
  setShowBatchUpdate: (show: boolean) => void;
  onShowAddForm: (show: boolean) => void;
  showAddForm: boolean;
}

export function DocumentsHeader({
  documentsCount,
  selectedCount,
  filtersCount,
  showBatchUpdate,
  setShowBatchUpdate,
  onShowAddForm,
  showAddForm
}: DocumentsHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-dark-700 pb-4 mb-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Documents</h2>
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded-full">
                {selectedCount} selected
              </span>
            )}
            <span className="px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center gap-1">
              <span>{documentsCount}</span>
              {filtersCount > 0 && (
                <span className="text-gray-400 dark:text-gray-500">
                  • {filtersCount} filter{filtersCount !== 1 ? 's' : ''}
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setShowBatchUpdate(!showBatchUpdate)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/75 rounded-md transition-colors"
            title="Batch tasks"
          >
            <ListChecks className="w-4 h-4" />
            <span className="whitespace-nowrap">Batch Tasks</span>
          </button>
          <button
            onClick={() => onShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/75 rounded-md transition-colors"
            title="Add new document"
          >
            <Plus className="w-4 h-4" />
            <span className="whitespace-nowrap">Add Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}