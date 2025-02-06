import React from 'react';

interface BaseCollectionFormProps {
  loading?: boolean;
}

interface LoadCollectionFormProps extends BaseCollectionFormProps {
  selectedCollection: string | null;
  onCollectionChange: (name: string) => void;
  onLoadCollections: () => Promise<void>;
  loading?: boolean;
}

interface CreateCollectionFormProps extends BaseCollectionFormProps {
  newCollectionName: string;
  newDocumentJson: string;
  newDocumentId: string;
  onCollectionNameChange: (name: string) => void;
  onDocumentJsonChange: (json: string) => void;
  onDocumentIdChange: (id: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

type CollectionFormProps = LoadCollectionFormProps | CreateCollectionFormProps;

export function CollectionForm(props: CollectionFormProps) {
  if ('selectedCollection' in props) {
    // Load Collection Form
    const { selectedCollection, onCollectionChange, onLoadCollections, loading } = props;

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && selectedCollection?.trim()) {
        e.preventDefault();
        onLoadCollections();
      }
    };

    return (
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Load Collection</h2>
        <div className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={selectedCollection || ''}
              onChange={(e) => onCollectionChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
              placeholder="Enter collection name to load..."
            />
            <button
              onClick={onLoadCollections}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 whitespace-nowrap disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load Collection'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter the name of an existing collection to load its documents
          </p>
        </div>
      </div>
    );
  }

  // Create Collection Form
  const { 
    newCollectionName, 
    newDocumentJson, 
    newDocumentId,
    onCollectionNameChange, 
    onDocumentJsonChange, 
    onDocumentIdChange,
    onSubmit 
  } = props;

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Collection</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Create a new collection with an initial document, or use the "Load Collection" button in the sidebar to connect to an existing collection.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Collection Name
          </label>
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => onCollectionNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
            placeholder="Enter collection name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Document ID (optional)
          </label>
          <input
            type="text"
            value={newDocumentId}
            onChange={(e) => onDocumentIdChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
            placeholder="Leave empty for auto-generated ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Document (JSON)
          </label>
          <textarea
            value={newDocumentJson}
            onChange={(e) => onDocumentJsonChange(e.target.value)}
            className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md font-mono bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
            placeholder="Paste JSON for the first document..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Create Collection
        </button>
      </form>
    </div>
  );
}