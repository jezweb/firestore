import React, { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';

interface BatchUpdateFormProps {
  batchUpdateField: string;
  setBatchUpdateField: (field: string) => void;
  batchUpdateValue: string;
  setBatchUpdateValue: (value: string) => void;
  selectedDocuments: string[];
  handleBatchUpdate: () => void;
  onBatchDownload: () => void;
  onBatchDelete: () => void;
}

export function BatchUpdateForm({
  batchUpdateField,
  setBatchUpdateField,
  batchUpdateValue,
  setBatchUpdateValue,
  selectedDocuments,
  handleBatchUpdate,
  onBatchDownload,
  onBatchDelete
}: BatchUpdateFormProps) {
  const [activeTab, setActiveTab] = useState<'update' | 'download' | 'delete'>('update');

  return (
    <div className="mb-4 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('update')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md ${
            activeTab === 'update'
              ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
          }`}
        >
          Update
        </button>
        <button
          onClick={() => setActiveTab('download')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md ${
            activeTab === 'download'
              ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
          }`}
        >
          Download
        </button>
        <button
          onClick={() => setActiveTab('delete')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md ${
            activeTab === 'delete'
              ? 'bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
          }`}
        >
          Delete
        </button>
      </div>

      {activeTab === 'update' && (
        <div className="space-y-3">
          <input
            type="text"
            value={batchUpdateField}
            onChange={(e) => setBatchUpdateField(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
            placeholder="Field name to add/update"
          />
          <textarea
            value={batchUpdateValue}
            onChange={(e) => setBatchUpdateValue(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-dark-600 rounded-md font-mono bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
            placeholder="Field value (string or valid JSON)"
            rows={3}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Select documents below to update
            </span>
            <button
              onClick={handleBatchUpdate}
              disabled={!selectedDocuments.length || !batchUpdateField.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update {selectedDocuments.length} Document{selectedDocuments.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'download' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Download selected documents as JSON files. Each document will be downloaded individually.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Select documents below to download
            </span>
            <button
              onClick={onBatchDownload}
              disabled={!selectedDocuments.length}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Download {selectedDocuments.length} Document{selectedDocuments.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'delete' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Warning: This action cannot be undone. Selected documents will be permanently deleted.
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Select documents below to delete
            </span>
            <button
              onClick={onBatchDelete}
              disabled={!selectedDocuments.length}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Delete {selectedDocuments.length} Document{selectedDocuments.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}