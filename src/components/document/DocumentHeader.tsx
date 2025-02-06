import React from 'react';
import { Edit2, Save, X, Code, FormInput, Copy, Download, Trash2 } from 'lucide-react';

interface DocumentHeaderProps {
  selectedDocument: any;
  editMode: boolean;
  editorMode: 'json' | 'form';
  setEditorMode: (mode: 'json' | 'form') => void;
  handleEditClick: () => void;
  handleSaveClick: () => void;
  setEditMode: (edit: boolean) => void;
  handleDuplicate: () => void;
  onDeleteDocument: (collection: string, id: string) => void;
  collectionName: string;
}

export function DocumentHeader({
  selectedDocument,
  editMode,
  editorMode,
  setEditorMode,
  handleEditClick,
  handleSaveClick,
  setEditMode,
  handleDuplicate,
  onDeleteDocument,
  collectionName
}: DocumentHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-dark-700 pb-4 mb-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Document Details</h2>

        {editMode ? (
          <div className="flex items-center gap-2">
            <div className="flex rounded-md overflow-hidden border border-gray-300 mr-2">
              <button
                onClick={() => setEditorMode('json')}
                className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 ${
                  editorMode === 'json'
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                    : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                }`}
              >
                <Code className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={() => setEditorMode('form')}
                className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 ${
                  editorMode === 'form'
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                    : 'bg-white dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                }`}
              >
                <FormInput className="w-4 h-4" />
                Form
              </button>
            </div>
            <button
              onClick={handleSaveClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={handleEditClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/75 rounded-md transition-colors"
              title="Edit document"
            >
              <Edit2 className="w-4 h-4" />
              <span className="whitespace-nowrap">Edit</span>
            </button>
            <button
              onClick={() => onDeleteDocument(collectionName, selectedDocument.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/75 rounded-md transition-colors"
              title="Delete document"
            >
              <Trash2 className="w-4 h-4" />
              <span className="whitespace-nowrap">Delete</span>
            </button>
            <button
              onClick={() => {
                const { id, ...data } = selectedDocument;
                const sortedData = { id, ...Object.keys(data).sort().reduce((obj, key) => ({ ...obj, [key]: data[key] }), {}) };
                const blob = new Blob([JSON.stringify(sortedData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${id}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/75 rounded-md transition-colors"
              title="Download document"
            >
              <Download className="w-4 h-4" />
              <span className="whitespace-nowrap">Download</span>
            </button>
            <button
              onClick={handleDuplicate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/75 rounded-md transition-colors"
              title="Duplicate document"
            >
              <Copy className="w-4 h-4" />
              <span className="whitespace-nowrap">Duplicate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}