import React from 'react';
import { Database, Save, FileJson, Settings, Search, Filter, Edit2 } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <Database className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Firestore Admin</h1>
        <p className="text-xl text-gray-600">
          A powerful, user-friendly interface for managing your Firebase Firestore collections
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Settings className="w-6 h-6 text-indigo-600" />}
              title="Profile Management"
              description="Save and manage multiple Firestore configurations. Switch between different projects seamlessly with saved profiles."
            />
            <FeatureCard
              icon={<FileJson className="w-6 h-6 text-indigo-600" />}
              title="Collection Management"
              description="Create, load, and manage Firestore collections with an intuitive interface. Add, edit, and delete documents easily."
            />
            <FeatureCard
              icon={<Search className="w-6 h-6 text-indigo-600" />}
              title="Advanced Search & Filtering"
              description="Search through documents with full-text search and create custom filters to find exactly what you need."
            />
            <FeatureCard
              icon={<Edit2 className="w-6 h-6 text-indigo-600" />}
              title="Document Editing"
              description="Edit documents with a powerful JSON editor featuring syntax highlighting or use the field-by-field form editor."
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">How It Works</h2>
          <div className="grid gap-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-indigo-600">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to Firebase</h3>
                <p className="text-gray-600 leading-relaxed">
                  Start by entering your Firebase configuration. You can paste the entire config object or enter the fields individually.
                  Your configuration is securely stored in the browser's local storage.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-indigo-600">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Profiles</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create profiles to save your Firebase configurations and associated collections. This makes it easy to switch between
                  different projects or environments without re-entering credentials.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-indigo-600">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Collections</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create new collections or load existing ones. Add documents with custom IDs or let Firebase generate them automatically.
                  The sidebar provides quick access to all your collections.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-indigo-600">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Work with Documents</h3>
                <p className="text-gray-600 leading-relaxed">
                  View, edit, and delete documents with our powerful document viewer. Use the JSON editor for direct manipulation
                  or switch to the form view for a more structured editing experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Data Security</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Database className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Local Storage Security</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Your Firebase configurations and profiles are stored securely in your browser's local storage. No data is sent
                to external servers except for direct communication with your Firebase project.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Firebase Security</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                All connections to Firebase use your project's security rules and authentication settings, ensuring your data
                remains protected according to your security configuration.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <p className="text-gray-600 mb-2">
            Developed by{' '}
            <a
              href="https://www.jezweb.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700"
            >
              Jezweb
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Made with ❤️ in Australia
          </p>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}