import React from 'react';
import { Database, Settings, X, Plus, FileJson, ChevronRight, Save, HelpCircle, Github, Home } from 'lucide-react';
import { Profile } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  profiles: Profile[];
  activeProfile: string | null;
  onLoadProfile: (profile: Profile) => void;
  onDeleteProfile: (name: string) => void;
  onCollectionSelect: (name: string) => Promise<void>;
  onNewCollection: () => void;
  onLoadCollectionForm: () => void;
  onSaveProfile: () => void;
  db: any;
  activeProfileCollections: string[];
  selectedCollection: string | null;
  onAboutClick: () => void;
}

export function Sidebar({
  profiles,
  activeProfile,
  onLoadProfile,
  onDeleteProfile,
  onCollectionSelect,
  onNewCollection,
  onLoadCollectionForm,
  onSaveProfile,
  db,
  activeProfileCollections,
  selectedCollection,
  onAboutClick,
}: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 fixed h-screen flex flex-col transition-colors z-20">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <a href="/" className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Firestore Admin</h1>
          </a>
          <div className="flex items-center gap-1 mt-4">
            <button
              onClick={() => window.location.href = '/'}
              className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button
              onClick={onAboutClick}
              className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md"
              title="About Firestore Admin"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <a
              href="https://github.com/jezweb/firestore"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Profiles</h2>
          <div className="space-y-2">
            {db && (
              <button
                onClick={onSaveProfile}
                className="flex items-center gap-2 w-full p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-dark-700 mb-1"
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            )}
            <div className="space-y-1">
          {profiles.map(profile => (
            <div
              key={profile.name}
              className={`flex items-center justify-between p-2 rounded-md ${
                activeProfile === profile.name 
                  ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                  : 'hover:bg-gray-50 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <button
                onClick={() => onLoadProfile(profile)}
                className="flex items-center gap-2 flex-1"
              >
                <Settings className="w-4 h-4 text-current" />
                <span className="text-sm">{profile.name}</span>
              </button>
              <button
                onClick={() => onDeleteProfile(profile.name)}
                className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
            </div>
          </div>
        </div>
      
      {db && (
        <div>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Collections</h2>
          <div className="space-y-2">
            <button
              onClick={onNewCollection}
              className="flex items-center gap-2 w-full p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-dark-700 mb-1"
            >
              <Plus className="w-4 h-4" />
              New Collection
            </button>
            <button
              onClick={onLoadCollectionForm}
              className="flex items-center gap-2 w-full p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-dark-700 mb-4"
            >
              <FileJson className="w-4 h-4" />
              Load Collection
            </button>
            <div className="space-y-1">
              {activeProfileCollections.map(colName => (
                <button
                  key={colName}
                  onClick={() => onCollectionSelect(colName)}
                  className={`flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-50 text-sm ${
                    selectedCollection === colName 
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <FileJson className="w-4 h-4" />
                  {colName}
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}