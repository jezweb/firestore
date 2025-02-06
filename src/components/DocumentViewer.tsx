import React from 'react';
import { Plus, ListChecks, Code, FormInput, Download } from 'lucide-react';
import { Collection, FilterConfig } from '../types';
import toast from 'react-hot-toast';
import { ViewToggle } from './document/ViewToggle';
import { TableView } from './document/TableView';
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
  const [view, setView] = React.useState<'table' | 'document'>('document');
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

  const handleBatchDownload = (format: 'json' | 'csv', combined: boolean) => {
    const selectedDocs = selectedDocuments.map(docId => {
      const doc = documents.find(d => d.id === docId);
      if (!doc) return null;
      
      const { id, ...data } = doc;
      return {
        id,
        ...Object.keys(data).sort().reduce((obj, key) => ({ ...obj, [key]: data[key] }), {})
      };
    }).filter(Boolean);

    if (combined) {
      // Combined file download
      let content: string;
      let mimeType: string;
      let extension: string;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      if (format === 'json') {
        content = JSON.stringify(selectedDocs, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      } else {
        // Get all unique headers
        const headers = Array.from(new Set(
          selectedDocs.flatMap(doc => Object.keys(doc))
        )).sort();
        
        // Create CSV content with all fields
        const rows = selectedDocs.map(doc => 
          headers.map(header => {
            const value = doc[header];
            return value === undefined ? '' : 
              typeof value === 'object' ? JSON.stringify(value) : String(value);
          })
        );
        
        content = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');
        
        mimeType = 'text/csv';
        extension = 'csv';
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documents_${timestamp}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Individual file downloads
      selectedDocs.forEach(doc => {
        let content: string;
        let mimeType: string;
        let extension: string;

        if (format === 'json') {
          content = JSON.stringify(doc, null, 2);
          mimeType = 'application/json';
          extension = 'json';
        } else {
          const headers = Object.keys(doc);
          const values = headers.map(header => {
            const value = doc[header];
            return typeof value === 'object' ? JSON.stringify(value) : String(value);
          });
          content = headers.join(',') + '\n' + values.join(',');
          mimeType = 'text/csv';
          extension = 'csv';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.id}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
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
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
      {view === 'document' ? (
        <div className="flex w-full">
          <div className="w-1/3 border-r border-gray-200 dark:border-dark-700 p-6 overflow-y-auto rounded-l-lg">
            <DocumentsHeader
              documentsCount={documents.length}
              selectedCount={selectedDocuments.length}
              filtersCount={filters.length}
              showBatchUpdate={showBatchUpdate}
              setShowBatchUpdate={setShowBatchUpdate}
              onShowAddForm={onShowAddForm}
              showAddForm={showAddForm}
              view={view}
              onViewChange={setView}
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
      ) : (
        <div className="w-full flex flex-col bg-white dark:bg-dark-800 overflow-hidden">
          <div className="p-6 pb-4 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center">
            <ViewToggle view={view} onViewChange={setView} />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {documents.length} document{documents.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <TableView
            documents={filteredDocuments}
            onDeleteDocument={onDeleteDocument}
            onUpdateDocument={onUpdateDocument}
            collectionName={collectionName}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={(field) => {
              if (sortField === field) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortField(field);
                setSortOrder('asc');
              }
            }}
          />
        </div>
      )}
    </div>
  );
}