import React from 'react';
import Editor from "@monaco-editor/react";
import { JsonEditor } from './JsonEditor';
import { FormEditor } from './FormEditor';

interface ViewerContentProps {
  selectedDocument: any;
  editMode: boolean;
  editorMode: 'json' | 'form';
  editedJson: string;
  setEditedJson: (json: string) => void;
  formFields: { key: string; value: string }[];
  handleFormFieldChange: (index: number, field: 'key' | 'value', newValue: string) => void;
  removeFormField: (index: number) => void;
  addFormField: () => void;
}

export function ViewerContent({
  selectedDocument,
  editMode,
  editorMode,
  editedJson,
  setEditedJson,
  formFields,
  handleFormFieldChange,
  removeFormField,
  addFormField
}: ViewerContentProps) {
  if (!selectedDocument) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <p>Select a document to view and edit</p>
      </div>
    );
  }

  if (editMode) {
    return editorMode === 'json' ? (
      <JsonEditor
        editMode={editMode}
        editedJson={editedJson}
        setEditedJson={setEditedJson}
      />
    ) : (
      <FormEditor
        formFields={formFields}
        handleFormFieldChange={handleFormFieldChange}
        removeFormField={removeFormField}
        addFormField={addFormField}
      />
    );
  }

  return (
    <Editor
      key="view"
      height="calc(100vh - 16rem)"
      defaultLanguage="json"
      value={JSON.stringify(Object.keys(selectedDocument)
        .filter(key => key !== 'id')
        .sort()
        .reduce((obj: Record<string, any>, key) => ({
          ...obj,
          [key]: selectedDocument[key]
        }), {}), null, 2)}
      theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light'}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}