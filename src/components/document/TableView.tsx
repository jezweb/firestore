import React, { useMemo } from 'react';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface TableViewProps {
  documents: any[];
  onDeleteDocument: (collection: string, id: string) => void;
  onUpdateDocument: (collection: string, id: string, newData: any) => void;
  collectionName: string;
  sortField: string | null;
  sortOrder: 'asc' | 'desc' | null;
  onSort: (field: string) => void;
}

function TableView({
  documents,
  onDeleteDocument,
  onUpdateDocument,
  collectionName,
  sortField,
  sortOrder,
  onSort
}: TableViewProps) {
  const [editingCell, setEditingCell] = React.useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Get all unique fields from all documents
  const columns = useMemo(() => {
    const allFields = new Set<string>();
    documents.forEach(doc => Object.keys(doc).forEach(key => allFields.add(key)));
    // Sort fields alphabetically, but keep 'id' first
    return ['id', ...Array.from(allFields).filter(f => f !== 'id').sort()];
  }, [documents]);

  // Format cell value for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const handleDoubleClick = (doc: any, field: string) => {
    if (field === 'id') return; // Don't allow editing IDs
    setEditingCell({ id: doc.id, field });
    setEditValue(formatValue(doc[field]));
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = async () => {
    if (!editingCell) return;

    try {
      const doc = documents.find(d => d.id === editingCell.id);
      if (!doc) return;

      let value = editValue;
      try {
        // Try to parse as JSON if it looks like an object or array
        if (value.startsWith('{') || value.startsWith('[')) {
          value = JSON.parse(value);
        }
        // Try to convert to number if it looks like one
        else if (!isNaN(Number(value)) && value.trim() !== '') {
          value = Number(value);
        }
      } catch {
        // If parsing fails, use the raw string value
      }

      const newData = { ...doc };
      delete newData.id;
      newData[editingCell.field] = value;

      await onUpdateDocument(collectionName, editingCell.id, newData);
      toast.success('Field updated successfully');
    } catch (error) {
      toast.error('Failed to update field');
      console.error(error);
    }

    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };
  return (
    <div className="relative flex-1 bg-white dark:bg-dark-800">
      <div className="absolute inset-0 overflow-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="sticky top-0 bg-gray-50 dark:bg-dark-900/50 border-b border-gray-200 dark:border-dark-700">
            {columns.map(column => (
              <th
                key={column}
                className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700"
                onClick={() => onSort(column)}
              >
                <div className="flex items-center gap-1">
                  <span className={column === 'id' ? 'text-indigo-600 dark:text-indigo-400' : ''}>
                    {column}
                  </span>
                  {sortField === column && (
                    sortOrder === 'asc' ? 
                      <ArrowUp className="w-4 h-4" /> : 
                      <ArrowDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr
              key={doc.id}
              className="border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
            >
              {columns.map(column => (
                <td
                  key={column}
                  className={`px-4 py-3 text-sm ${
                    column === 'id' 
                      ? 'font-mono text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                  onDoubleClick={() => handleDoubleClick(doc, column)}
                >
                  {editingCell?.id === doc.id && editingCell?.field === column ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      className="w-full px-2 py-1 border border-indigo-500 dark:border-indigo-400 rounded bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="max-w-xs truncate">
                      {formatValue(doc[column])}
                    </div>
                  )}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteDocument(collectionName, doc.id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export { TableView };