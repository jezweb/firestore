import React from 'react';
import { FirebaseConfig } from '../types';
import toast from 'react-hot-toast';

function parseFirebaseConfig(configString: string): FirebaseConfig | null {
  try {
    // Regular expressions to find the config values
    const apiKeyMatch = configString.match(/apiKey:\s*"(.*?)"/);
    const authDomainMatch = configString.match(/authDomain:\s*"(.*?)"/);
    const projectIdMatch = configString.match(/projectId:\s*"(.*?)"/);
    const storageBucketMatch = configString.match(/storageBucket:\s*"(.*?)"/);
    const messagingSenderIdMatch = configString.match(/messagingSenderId:\s*"(.*?)"/);
    const appIdMatch = configString.match(/appId:\s*"(.*?)"/);

    // Extract the values from the matches
    const apiKey = apiKeyMatch ? apiKeyMatch[1] : null;
    const authDomain = authDomainMatch ? authDomainMatch[1] : null;
    const projectId = projectIdMatch ? projectIdMatch[1] : null;
    const storageBucket = storageBucketMatch ? storageBucketMatch[1] : null;
    const messagingSenderId = messagingSenderIdMatch ? messagingSenderIdMatch[1] : null;
    const appId = appIdMatch ? appIdMatch[1] : null;

    // Validate that all required fields are present
    if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
      return null;
    }

    return {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };
  } catch (error) {
    console.error('Error parsing Firebase config:', error);
    return null;
  }
}

interface FirebaseConnectProps {
  config: FirebaseConfig | null;
  configJson: string;
  onConfigChange: (config: FirebaseConfig) => void;
  onConfigJsonChange: (json: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function FirebaseConnect({ config, configJson, onConfigChange, onConfigJsonChange, onSubmit }: FirebaseConnectProps) {

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Connect to Firebase</h2>
      <p className="text-sm text-gray-500 mb-6">
        Connect to your Firebase project to start managing collections. After connecting, you can create new collections or load existing ones from the sidebar.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Firebase Configuration
              </label>
              <button
                type="button"
                onClick={() => {
                  onConfigJsonChange('');
                  onConfigChange({} as FirebaseConfig);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Clear All
              </button>
            </div>
            <div className="relative">
              <textarea
                value={configJson}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md mb-4"
                placeholder="Paste your complete Firebase configuration here..."
                onChange={(e) => {
                  onConfigJsonChange(e.target.value);
                  const configText = e.target.value.trim();
                  if (!configText) return;

                  const parsed = parseFirebaseConfig(configText);
                  if (parsed) {
                    onConfigChange(parsed);
                    toast.success('Firebase configuration detected!');
                  } else if (configText.includes('firebaseConfig')) {
                    toast.error('Invalid Firebase configuration format');
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                value={config?.apiKey || ''}
                onChange={(e) => onConfigChange({ ...config!, apiKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter API key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                value={config?.authDomain || ''}
                onChange={(e) => onConfigChange({ ...config!, authDomain: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter auth domain"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project ID
              </label>
              <input
                type="text"
                value={config?.projectId || ''}
                onChange={(e) => onConfigChange({ ...config!, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter project ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Bucket
              </label>
              <input
                type="text"
                value={config?.storageBucket || ''}
                onChange={(e) => onConfigChange({ ...config!, storageBucket: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter storage bucket"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Messaging Sender ID
              </label>
              <input
                type="text"
                value={config?.messagingSenderId || ''}
                onChange={(e) => onConfigChange({ ...config!, messagingSenderId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter messaging sender ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App ID
              </label>
              <input
                type="text"
                value={config?.appId || ''}
                onChange={(e) => onConfigChange({ ...config!, appId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter app ID"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!config?.apiKey || !config?.projectId}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Connect to Firebase
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}