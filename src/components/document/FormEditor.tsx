import React from 'react';
import { X } from 'lucide-react';

interface FormEditorProps {
  formFields: { key: string; value: string }[];
  handleFormFieldChange: (index: number, field: 'key' | 'value', newValue: string) => void;
  removeFormField: (index: number) => void;
  addFormField: () => void;
}

export function FormEditor({
  formFields,
  handleFormFieldChange,
  removeFormField,
  addFormField
}: FormEditorProps) {
  // Separate ID field from other fields
  const idField = formFields.find(field => field.key === 'id');
  const otherFields = formFields.filter(field => field.key !== 'id');

  return (
    <div className="space-y-4 dark:text-white">
      <div className="bg-white dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-700">
        {idField && (
          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex gap-3">
              <input
                type="text"
                value={idField.key}
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm bg-gray-50 dark:bg-dark-900 text-indigo-600 dark:text-indigo-400 font-semibold"
              />
              <input
                type="text"
                value={idField.value}
                disabled
                className="flex-[2] px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-mono bg-gray-50 dark:bg-dark-900 text-indigo-600 dark:text-indigo-400"
              />
            </div>
          </div>
        )}
        {otherFields.map((field, index) => (
          <div key={index} className="flex gap-3 mb-3">
            <input
              type="text"
              value={field.key}
              onChange={(e) => handleFormFieldChange(index, 'key', e.target.value)}
              placeholder="Field name"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
            />
            <textarea
              value={field.value}
              onChange={(e) => handleFormFieldChange(index, 'value', e.target.value)}
              placeholder="Field value"
              className="flex-[2] px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-mono bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
              rows={1}
            />
            <button 
              type="button"
              onClick={() => removeFormField(index)}
              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFormField}
          className="w-full mt-2 px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 border border-dashed border-gray-300 dark:border-dark-600 rounded-md hover:border-indigo-300 dark:hover:border-indigo-700"
        >
          + Add Field
        </button>
      </div>
    </div>
  );
}