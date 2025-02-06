import React from 'react';
import { Trash2 } from 'lucide-react';

interface DocumentListProps {
  filteredDocuments: any[];
  selectedDocument: any;
  showBatchUpdate: boolean;
  selectedDocuments: string[];
  toggleDocumentSelection: (id: string) => void;
  toggleAllDocuments: () => void;
  onDocumentSelect: (doc: any) => void;
  onDeleteDocument: (collection: string, id: string) => void;
  collectionName: string;
}

export function DocumentList({
  filteredDocuments,
  selectedDocument,
  showBatchUpdate,
  selectedDocuments,
  toggleDocumentSelection,
  toggleAllDocuments,
  onDocumentSelect,
  onDeleteDocument,
  collectionName
}: DocumentListProps) {
  return (
    <div>
      {showBatchUpdate && (
        <div className="mb-2 flex items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={selectedDocuments.length === filteredDocuments.length}
              onChange={toggleAllDocuments}
              className="w-4 h-4 text-indigo-600 dark:text-indigo-400 rounded border-gray-300 dark:border-dark-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-dark-900 checked:bg-indigo-600 dark:checked:bg-indigo-600"
            />
            Select All
          </label>
        </div>
      )}
      <div className="space-y-2">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id} 
            className={`flex items-center w-full text-left px-2 py-1.5 rounded-md transition-colors ${
              selectedDocument?.id === doc.id 
                ? 'bg-indigo-50 dark:bg-indigo-900/50' 
                : 'hover:bg-gray-50 dark:hover:bg-dark-700'
            } ${selectedDocuments.includes(doc.id) ? 'border-2 border-indigo-500 dark:border-indigo-400' : ''}`}
          >
            {showBatchUpdate && (
              <div className="mr-2">
                <input
                  type="checkbox"
                  checked={selectedDocuments.includes(doc.id)}
                  onChange={() => toggleDocumentSelection(doc.id)}
                  className="w-4 h-4 text-indigo-600 dark:text-indigo-400 rounded border-gray-300 dark:border-dark-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-dark-900 checked:bg-indigo-600 dark:checked:bg-indigo-600"
                />
              </div>
            )}
            <div
              className="flex-1 cursor-pointer"
              onClick={() => onDocumentSelect(doc)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <code className="px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded-full font-mono truncate">
                    {doc.id}
                  </code>
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {Object.keys(doc).length - 1} fields
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(collectionName, doc.id);
                  }}
                  className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-0.5 rounded-md opacity-0 group-hover:opacity-100 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}