import React from 'react';
import { Search, Filter, ArrowDownAZ, ArrowUpAZ, ArrowUpDown, X } from 'lucide-react';
import { FilterConfig } from '../../types';

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: FilterConfig[];
  setFilters: (filters: FilterConfig[]) => void;
  sortOrder: 'asc' | 'desc' | null;
  setSortOrder: (order: 'asc' | 'desc' | null) => void;
  sortField: string | null;
  setSortField: (field: string | null) => void;
}

export function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  sortOrder,
  setSortOrder,
  sortField,
  setSortField
}: SearchAndFiltersProps) {
  return (
    <div className="mb-4 space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Search documents..."
          />
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-md transition-colors ${
            showFilters || filters.length > 0
              ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Filter documents"
        >
          <Filter className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            if (sortOrder === null) {
              setSortOrder('asc');
            } else if (sortOrder === 'asc') {
              setSortOrder('desc');
            } else {
              setSortOrder(null);
              setSortField(null);
            }
          }}
          className={`p-2 rounded-md transition-colors ${
            sortOrder
              ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Sort documents"
        >
          {sortOrder === 'asc' ? (
            <ArrowDownAZ className="w-5 h-5" />
          ) : sortOrder === 'desc' ? (
            <ArrowUpAZ className="w-5 h-5" />
          ) : (
            <ArrowUpDown className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {sortOrder && (
        <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-md">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={sortField || ''}
              onChange={(e) => setSortField(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
              placeholder="Enter field name to sort by..."
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
            </span>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-md space-y-2">
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
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
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
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-900 text-gray-900 dark:text-white"
                placeholder="Value"
              />
              <button
                onClick={() => {
                  setFilters(filters.filter((_, i) => i !== index));
                }}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setFilters([...filters, { field: '', value: '' }])}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            + Add filter
          </button>
        </div>
      )}
    </div>
  );
}