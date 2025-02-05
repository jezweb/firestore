import React from 'react';
import { X, Save } from 'lucide-react';

interface ProfileModalProps {
  show: boolean;
  profileName: string;
  onProfileNameChange: (name: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function ProfileModal({ show, profileName, onProfileNameChange, onSave, onClose }: ProfileModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Save Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          type="text"
          value={profileName}
          onChange={(e) => onProfileNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          placeholder="Enter profile name"
        />
        <button
          onClick={onSave}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          <div className="flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Save Profile
          </div>
        </button>
      </div>
    </div>
  );
}