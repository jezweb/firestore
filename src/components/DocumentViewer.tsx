import React from 'react';
import { Trash2, Plus, Edit2, Save, X, Search, Filter, Copy, Code, FormInput } from 'lucide-react';
import { Collection } from '../types';
import toast from 'react-hot-toast';
import Editor from "@monaco-editor/react";

interface FilterConfig {
  field: string;
  value: string;
}

interface DocumentViewerProps {
  collections: Collection[];
  showAddForm: boolean;
  newDocumentId: string;
  onNewDocumentIdChange: (id: string) => void;
  onShowAddForm: (show: boolean) => void;
  newDocumentJson: string;
  onNewDocumentJsonChange: (json: string) => void;
  onAddDocument: (e: React.FormEvent) => void;
  selectedDocument: any;
  onDocumentSelect: (doc: any) => void;
  onDeleteDocument: (collectionName: string, id: string) => void;
  onUpdateDocument: (collectionName: string, id: string, newData: any) => void;
}

export function DocumentViewer({
  collections,
  showAddForm,
  newDocumentId,
  onNewDocumentIdChange,
  onShowAddForm,
  newDocumentJson,
  onNewDocumentJsonChange,
  onAddDocument,
  selectedDocument,
  onDocumentSelect,
  onDeleteDocument,
  onUpdateDocument
}: DocumentViewerProps) {
  const documents = collections[0]?.documents || [];
  const collectionName = collections[0]?.name;
  const [editMode, setEditMode] = React.useState(false);
  const [editedJson, setEditedJson] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [editorMode, setEditorMode] = React.useState<'json' | 'form'>('json');
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterConfig[]>([]);
  const [formFields, setFormFields] = React.useState<{ key: string; value: string }[]>([]);

  const handleDuplicate = async () => {
    if (!selectedDocument) return;
    
    const { id: originalId, ...docWithoutId } = selectedDocument;
    const timestamp = new Date().getTime();
    const newId = `${originalId}_copy_${timestamp}`;
    
    try {
      onNewDocumentIdChange(newId);
      onNewDocumentJsonChange(JSON.stringify(docWithoutId, null, 2));
      onShowAddForm(true);
      toast.success('Document ready to duplicate. Review and save to confirm.');
    } catch (error) {
      toast.error('Failed to prepare document for duplication');
      console.error(error);
    }
  };

  const filteredDocuments = React.useMemo(() => {
    return documents.filter(doc => {
      const docString = JSON.stringify(doc).toLowerCase();
      const matchesSearch = searchTerm ? docString.includes(searchTerm.toLowerCase()) : true;
      
      const matchesFilters = filters.every(filter => {
        const value = doc[filter.field];
        return value && String(value).toLowerCase().includes(filter.value.toLowerCase());
      });
      
      return matchesSearch && matchesFilters;
    });
  }, [documents, searchTerm, filters]);

  const handleEditClick = () => {
    setEditMode(true);
    setEditorMode('json');
    setEditedJson(JSON.stringify(selectedDocument, null, 2));
    // Initialize form fields
    const { id, ...data } = selectedDocument;
    setFormFields(
      Object.entries(data).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value)
      }))
    );
  };

  const handleSaveClick = async () => {
    try {
      let newData;
      if (editorMode === 'json') {
        newData = JSON.parse(editedJson);
      } else {
        // Convert form fields back to an object
        newData = formFields.reduce((acc, { key, value }) => {
          try {
            // Try to parse as JSON if possible
            acc[key] = JSON.parse(value);
          } catch {
            // If not valid JSON, use the raw value
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>);
      }
      const { id, ...dataWithoutId } = newData;
      await onUpdateDocument(collectionName, selectedDocument.id, dataWithoutId);
      setEditMode(false);
    } catch (error) {
      toast.error(editorMode === 'json' ? 'Invalid JSON format' : 'Invalid field value format');
    }
  };

  const handleFormFieldChange = (index: number, field: 'key' | 'value', newValue: string) => {
    const newFields = [...formFields];
    newFields[index][field] = newValue;
    setFormFields(newFields);
  };

  const addFormField = () => {
    setFormFields([...formFields, { key: '', value: '' }]);
  };

  const removeFormField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <div className="w-1/3 border-r pr-4 overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-gray-900">Documents</h2>
            <span className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
              {documents.length}
              {filters.length > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  Matches {filters.length} filter{filters.length !== 1 ? 's' : ''}
                </span>
              )}
            </span>
          </div>
          <div>
            <button
              onClick={() => onShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Document
            </button>
          </div>
        </div>
        
        <div className="mb-4 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="Search documents..."
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md transition-colors ${
                showFilters || filters.length > 0
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {showFilters && (
            <div className="p-3 bg-gray-50 rounded-md space-y-2">
              {filters.map((filter, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={filter.field}
                    onChange={(e) => {
                      const newFilters = [...filters];
                      newFilters[index].field = e.target.value;
                      setFilters(newFilters);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                    placeholder="Field name"
                  />
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => {
                      const newFilters = [...filters];
                      newFilters[index].value = e.target.value;
                      setFilters(newFilters);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                    placeholder="Value"
                  />
                  <button
                    onClick={() => {
                      setFilters(filters.filter((_, i) => i !== index));
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setFilters([...filters, { field: '', value: '' }])}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                + Add filter
              </button>
            </div>
          )}
        </div>
        
        {showAddForm && (
          <form onSubmit={onAddDocument} className="mb-4">
            <div className="space-y-3">
              <input
                type="text"
                value={newDocumentId}
                onChange={(e) => onNewDocumentIdChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Document ID (optional)"
              />
              <textarea
                value={newDocumentJson}
                onChange={(e) => onNewDocumentJsonChange(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                placeholder="Paste JSON for the new document..."
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-sm"
              >
                Add Document
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onDocumentSelect(doc)}
              className={`w-full text-left p-3 rounded-md transition-colors ${
                selectedDocument?.id === doc.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm truncate">
                  {doc.id}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(collectionName, doc.id);
                  }}
                  className={`text-gray-400 hover:text-red-600 p-1 rounded-md ${
                    selectedDocument?.id === doc.id
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-1 text-sm text-gray-500 truncate">
                {Object.keys(doc).length - 1} fields
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 pl-4 overflow-y-auto">
        {selectedDocument ? (
          <>
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium text-gray-900">Document</h2>
                <code className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                  {selectedDocument.id}
                </code>
              </div>
              <div className="flex gap-2">
                {editMode ? (
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-md overflow-hidden border border-gray-300 mr-2">
                      <button
                        onClick={() => setEditorMode('json')}
                        className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 ${
                          editorMode === 'json'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Code className="w-4 h-4" />
                        JSON
                      </button>
                      <button
                        onClick={() => setEditorMode('form')}
                        className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 ${
                          editorMode === 'form'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEditClick}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
                {!editMode && (
                  <button
                    onClick={handleDuplicate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                )}
              </div>
            </div>
            {editMode ? (
              editorMode === 'json' ? (
                <Editor
                  key={editMode ? 'edit' : 'view'}
                  height="calc(100vh - 16rem)"
                  defaultLanguage="json"
                  value={editedJson}
                  onChange={(value) => setEditedJson(value || '')}
                  theme="vs-light"
                  options={{
                    readOnly: false,
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    formatOnPaste: true,
                    formatOnType: true
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    {formFields.map((field, index) => (
                      <div key={index} className="flex gap-3 mb-3">
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) => handleFormFieldChange(index, 'key', e.target.value)}
                          placeholder="Field name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <textarea
                          value={field.value}
                          onChange={(e) => handleFormFieldChange(index, 'value', e.target.value)}
                          placeholder="Field value"
                          className="flex-[2] px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                          rows={1}
                        />
                        <button
                          onClick={() => removeFormField(index)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addFormField}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </button>
                  </div>
                </div>
              )
            ) : (
              <Editor
                key="view"
                height="calc(100vh - 16rem)"
                defaultLanguage="json"
                value={JSON.stringify(selectedDocument, null, 2)}
                theme="vs-light"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a document to view its contents
          </div>
        )}
      </div>
    </div>
  );
}