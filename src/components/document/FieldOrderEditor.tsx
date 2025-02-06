import React from 'react';

interface FieldOrderEditorProps {
  showApplyOrderMenu: boolean;
  setShowApplyOrderMenu: (show: boolean) => void;
  applyFieldOrder: () => void;
  showBatchUpdate: boolean;
  selectedDocuments: string[];
  documentsLength: number;
  applyFieldOrderToOthers: () => void;
  orderedFields: string[];
  handleFieldReorder: (fromIndex: number, toIndex: number) => void;
}

export function FieldOrderEditor({
  showApplyOrderMenu,
  setShowApplyOrderMenu,
  applyFieldOrder,
  showBatchUpdate,
  selectedDocuments,
  documentsLength,
  applyFieldOrderToOthers,
  orderedFields,
  handleFieldReorder
}: FieldOrderEditorProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900">Field Order</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowApplyOrderMenu(!showApplyOrderMenu)}
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
            >
              Apply to Others
            </button>
            <button
              onClick={applyFieldOrder}
              className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Apply Order
            </button>
          </div>
        </div>
        {showApplyOrderMenu && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              Apply this field order to other documents in the collection:
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {showBatchUpdate ? 'Using selected documents' : 'Will apply to all other documents'}
              </span>
              <button
                onClick={applyFieldOrderToOthers}
                className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Apply to {showBatchUpdate ? selectedDocuments.length : documentsLength - 1} Document{
                  (showBatchUpdate ? selectedDocuments.length : documentsLength - 1) !== 1 ? 's' : ''
                }
              </button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {orderedFields.map((field, index) => (
            <div
              key={field}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-mono">{field}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleFieldReorder(index, Math.max(0, index - 1))}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-50"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleFieldReorder(index, Math.min(orderedFields.length - 1, index + 1))}
                  disabled={index === orderedFields.length - 1}
                  className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-50"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}