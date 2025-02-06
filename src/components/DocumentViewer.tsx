import React from 'react';
import { Plus, ListChecks, Code, FormInput, Download } from 'lucide-react';
import { Collection, FilterConfig } from '../types';
import toast from 'react-hot-toast';
import { DocumentHeader } from './document/DocumentHeader';
import { DocumentList } from './document/DocumentList';
import { SearchAndFilters } from './document/SearchAndFilters';
import { DocumentsHeader } from './document/DocumentsHeader';
import { BatchUpdateForm } from './document/BatchUpdateForm';
import { AddDocumentForm } from './document/AddDocumentForm';
import { ViewerContent } from './document/ViewerContent';

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
  onBatchUpdate: (collectionName: string, updates: Record<string, any>, selectedDocs: string[]) => Promise<void>;
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
  onUpdateDocument,
  onBatchUpdate
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
  const [showBatchUpdate, setShowBatchUpdate] = React.useState(false);
  const [batchUpdateField, setBatchUpdateField] = React.useState('');
  const [batchUpdateValue, setBatchUpdateValue] = React.useState('');
  const [selectedDocuments, setSelectedDocuments] = React.useState<string[]>([]);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc' | null>(null);
  const [sortField, setSortField] = React.useState<string | null>(null);

  // Memoize document sorting and filtering logic
  const filteredDocuments = React.useMemo(() => {
    let filtered = documents.filter(doc => {
      const docString = JSON.stringify(doc).toLowerCase();
      const matchesSearch = searchTerm ? docString.includes(searchTerm.toLowerCase()) : true;
      
      return matchesSearch && filters.every(filter => {
        const value = doc[filter.field];
        return value && String(value).toLowerCase().includes(filter.value.toLowerCase());
      });
    });

    if (sortField && sortOrder) {
      return [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === undefined) return sortOrder === 'asc' ? 1 : -1;
        if (bValue === undefined) return sortOrder === 'asc' ? -1 : 1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortOrder === 'asc' 
          ? (aValue > bValue ? 1 : -1)
          : (bValue > aValue ? 1 : -1);
      });
    }

    return filtered;
  }, [documents, searchTerm, filters, sortField, sortOrder]);

  const toggleAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleBatchUpdate = async () => {
    if (!batchUpdateField.trim() || !selectedDocuments.length) {
      toast.error('Please provide a field name and select at least one document');
      return;
    }

    try {
      let value = batchUpdateValue;
      try {
        value = JSON.parse(batchUpdateValue);
      } catch {
        // If not valid JSON, use the raw string value
      }

      const updates = { [batchUpdateField]: value };
      await onBatchUpdate(collectionName, updates, selectedDocuments);
      setShowBatchUpdate(false);
      setBatchUpdateField('');
      setBatchUpdateValue('');
      setSelectedDocuments([]);
    } catch (error) {
      toast.error('Failed to update documents');
      console.error(error);
    }
  };

  const handleBatchDownload = () => {
    selectedDocuments.forEach(docId => {
      const doc = documents.find(d => d.id === docId);
      if (doc) {
        const { id, ...data } = doc;
        const sortedData = {
          id,
          ...Object.keys(data).sort().reduce((obj, key) => ({ ...obj, [key]: data[key] }), {})
        };
        const blob = new Blob([JSON.stringify(sortedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleBatchDelete = async () => {
    if (!selectedDocuments.length) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedDocuments.length} document${
        selectedDocuments.length === 1 ? '' : 's'
      }? This action cannot be undone.`
    );

    if (confirmDelete) {
      try {
        await Promise.all(
          selectedDocuments.map(docId => onDeleteDocument(collectionName, docId))
        );
        setSelectedDocuments([]);
        toast.success('Documents deleted successfully');
      } catch (error) {
        toast.error('Failed to delete some documents');
        console.error(error);
      }
    }
  };

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

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

  // Memoize form fields transformation
  const transformToFormFields = React.useCallback((data: Record<string, any>) => {
    return Object.entries(data).map(([key, value]) => ({
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value)
    }));
  }, []);

  const handleEditClick = React.useCallback(() => {
    setEditMode(true);
    setEditorMode('json');

    const { id, ...data } = selectedDocument;
    const sortedData = Object.keys(data)
      .sort()
      .reduce((obj: Record<string, any>, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    setEditedJson(JSON.stringify(sortedData, null, 2));
    setFormFields(transformToFormFields(sortedData));
  }, [selectedDocument, transformToFormFields]);

  const handleSaveClick = async () => {
    try {
      let newData;
      if (editorMode === 'json') {
        newData = JSON.parse(editedJson);
      } else {
        newData = formFields.reduce((acc, { key, value }) => {
          try {
            acc[key] = JSON.parse(value);
          } catch {
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
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-dark-800 rounded-lg shadow">
      <div className="w-1/3 border-r border-gray-200 dark:border-dark-700 p-6 overflow-y-auto rounded-l-lg">
        <DocumentsHeader
          documentsCount={documents.length}
          selectedCount={selectedDocuments.length}
          filtersCount={filters.length}
          showBatchUpdate={showBatchUpdate}
          setShowBatchUpdate={setShowBatchUpdate}
          onShowAddForm={onShowAddForm}
          showAddForm={showAddForm}
        />
        
        {showBatchUpdate && (
          <BatchUpdateForm
            batchUpdateField={batchUpdateField}
            setBatchUpdateField={setBatchUpdateField}
            batchUpdateValue={batchUpdateValue}
            setBatchUpdateValue={setBatchUpdateValue}
            selectedDocuments={selectedDocuments}
            handleBatchUpdate={handleBatchUpdate}
            onBatchDownload={handleBatchDownload}
            onBatchDelete={handleBatchDelete}
          />
        )}

        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          sortField={sortField}
          setSortField={setSortField}
        />
        
        {showAddForm && (
          <AddDocumentForm
            newDocumentId={newDocumentId}
            onNewDocumentIdChange={onNewDocumentIdChange}
            newDocumentJson={newDocumentJson}
            onNewDocumentJsonChange={onNewDocumentJsonChange}
            onAddDocument={onAddDocument}
          />
        )}

        <DocumentList
          filteredDocuments={filteredDocuments}
          selectedDocument={selectedDocument}
          showBatchUpdate={showBatchUpdate}
          selectedDocuments={selectedDocuments}
          toggleDocumentSelection={toggleDocumentSelection}
          toggleAllDocuments={toggleAllDocuments}
          onDocumentSelect={onDocumentSelect}
          onDeleteDocument={onDeleteDocument}
          collectionName={collectionName}
        />
      </div>

      <div className="flex-1 p-6 overflow-y-auto rounded-r-lg">
        {selectedDocument && (
          <>
            <DocumentHeader
              selectedDocument={selectedDocument}
              editMode={editMode}
              editorMode={editorMode}
              setEditorMode={setEditorMode}
              handleEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              setEditMode={setEditMode}
              handleDuplicate={handleDuplicate}
              onDeleteDocument={onDeleteDocument}
              collectionName={collectionName}
            />
            <ViewerContent
              selectedDocument={selectedDocument}
              editMode={editMode}
              editorMode={editorMode}
              editedJson={editedJson}
              setEditedJson={setEditedJson}
              formFields={formFields}
              handleFormFieldChange={handleFormFieldChange}
              removeFormField={removeFormField}
              addFormField={addFormField}
            />
          </>
        )}
      </div>
    </div>
  );
}