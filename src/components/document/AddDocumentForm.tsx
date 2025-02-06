import React from 'react';

interface AddDocumentFormProps {
  newDocumentId: string;
  onNewDocumentIdChange: (id: string) => void;
  newDocumentJson: string;
  onNewDocumentJsonChange: (json: string) => void;
  onAddDocument: (e: React.FormEvent) => void;
}

export function AddDocumentForm({
  newDocumentId,
  onNewDocumentIdChange,
  newDocumentJson,
  onNewDocumentJsonChange,
  onAddDocument
}: AddDocumentFormProps) {
  return (
    <form onSubmit={onAddDocument} className="mb-4">
      <div className="space-y-3">
        <input
          type="text"
          value={newDocumentId}
          onChange={(e) => onNewDocumentIdChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
          placeholder="Document ID (optional)"
        />
        <textarea
          value={newDocumentJson}
          onChange={(e) => onNewDocumentJsonChange(e.target.value)}
          className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md font-mono text-sm bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
          placeholder="Paste JSON for the new document..."
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-sm disabled:opacity-50"
        >
          Add Document
        </button>
      </div>
    </form>
  );
}