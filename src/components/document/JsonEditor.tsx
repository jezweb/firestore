import React from 'react';
import Editor from "@monaco-editor/react";

interface JsonEditorProps {
  editMode: boolean;
  editedJson: string;
  setEditedJson: (json: string) => void;
}

export function JsonEditor({
  editMode,
  editedJson,
  setEditedJson
}: JsonEditorProps) {
  const formatJson = (json: string): string => {
    try {
      const parsed = JSON.parse(json);
      // Sort the remaining fields alphabetically
      const sortedData = Object.keys(parsed)
        .sort()
        .reduce((obj: Record<string, any>, key) => {
          obj[key] = parsed[key];
          return obj;
        }, {});
      // Return formatted JSON
      return JSON.stringify(sortedData, null, 2);
    } catch {
      return json;
    }
  };

  return (
    <Editor
      key={editMode ? 'edit' : 'view'}
      height="calc(100vh - 16rem)"
      defaultLanguage="json"
      value={formatJson(editedJson)}
      onChange={(value) => setEditedJson(value || '')}
      theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light'}
      options={{
        readOnly: false,
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
        formatOnType: true,
        theme: document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light'
      }}
    />
  );
}