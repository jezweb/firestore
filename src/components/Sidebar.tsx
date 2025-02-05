import React from 'react';
import { Database, Settings, X, Plus, FileJson, ChevronRight, Save, HelpCircle } from 'lucide-react';
import { Profile } from '../types';

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
    <div className="w-64 bg-white border-r border-gray-200 fixed h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">Firestore Admin</h1>
          </div>
          <button
            onClick={onAboutClick}
            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md"
            title="About Firestore Admin"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">PROFILES</h2>
          <div className="space-y-2">
            {db && (
              <button
                onClick={onSaveProfile}
                className="flex items-center gap-2 w-full p-2 text-sm text-gray-600 hover:text-indigo-600 rounded-md hover:bg-indigo-50 mb-1"
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
                activeProfile === profile.name ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
              }`}
            >
              <button
                onClick={() => onLoadProfile(profile)}
                className="flex items-center gap-2 flex-1"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">{profile.name}</span>
              </button>
              <button
                onClick={() => onDeleteProfile(profile.name)}
                className="text-gray-400 hover:text-red-600"
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
          <h2 className="text-sm font-medium text-gray-500 mb-2">COLLECTIONS</h2>
          <div className="space-y-2">
            <button
              onClick={onNewCollection}
              className="flex items-center gap-2 w-full p-2 text-sm text-gray-600 hover:text-indigo-600 rounded-md hover:bg-indigo-50 mb-1"
            >
              <Plus className="w-4 h-4" />
              New Collection
            </button>
            <button
              onClick={onLoadCollectionForm}
              className="flex items-center gap-2 w-full p-2 text-sm text-gray-600 hover:text-indigo-600 rounded-md hover:bg-indigo-50 mb-4"
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
                    selectedCollection === colName ? 'bg-indigo-50 text-indigo-600' : ''
                  }`}
                >
                  <FileJson className="w-4 h-4" />
                  {colName}
                  <ChevronRight className="w-4 h-4 ml-auto" />
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