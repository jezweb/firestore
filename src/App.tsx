import React from 'react';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDoc,
  writeBatch,
  setDoc,
  updateDoc,
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { FirebaseConfig, Profile, Collection } from './types';
import { ProfileModal } from './components/ProfileModal';
import { Sidebar } from './components/Sidebar';
import { FirebaseConnect } from './components/FirebaseConnect';
import { DocumentViewer } from './components/DocumentViewer';
import { CollectionForm } from './components/CollectionForm';
import { About } from './components/About';

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const [config, setConfig] = useState<FirebaseConfig | null>({} as FirebaseConfig);
  const [db, setDb] = useState<any>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newDocumentJson, setNewDocumentJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [configJson, setConfigJson] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showLoadCollectionForm, setShowLoadCollectionForm] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [loadedCollections, setLoadedCollections] = useState<string[]>([]);
  const [showAddDocumentForm, setShowAddDocumentForm] = useState(false);
  const [newDocumentJsonForExisting, setNewDocumentJsonForExisting] = useState('');
  const [newDocumentId, setNewDocumentId] = useState('');
  const [showAbout, setShowAbout] = useState(false);
  const [newDocumentIdForExisting, setNewDocumentIdForExisting] = useState('');

  // Memoize profile loading logic
  const loadProfileData = React.useCallback((profile: Profile) => {
    setConfig(profile.config);
    setActiveProfile(profile.name);
    setLoadedCollections(profile.collections);
    handleConfigSubmit(new Event('submit') as any, profile.config);
  }, []);

  // Memoize collection loading logic
  const loadCollectionData = React.useCallback(async (colName: string) => {
    const collections = await getDocs(collection(db, colName));
    return collections.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }, [db]);

  useEffect(() => {
    const savedProfiles = localStorage.getItem('firebaseProfiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('firebaseProfiles', JSON.stringify(profiles));
  }, [profiles]);

  const handleCollectionSelect = async (colName: string) => {
    setSelectedCollection(colName);
    const docs = await loadCollectionData(colName);
    setCollections([{ name: colName, documents: docs }]);
    if (!loadedCollections.includes(colName)) {
      setLoadedCollections(prev => [...prev, colName]);
    }
  };

  const saveProfile = () => {
    if (!profileName.trim() || !config) {
      toast.error('Please provide a profile name and valid configuration');
      return;
    }

    const newProfile: Profile = {
      name: profileName,
      config: config,
      collections: collections.map(c => c.name)
    };

    setProfiles(current => [...current, newProfile]);
    setActiveProfile(profileName);
    setShowProfileModal(false);
    setProfileName('');
    toast.success('Profile saved successfully!');
  };

  const loadProfile = React.useCallback((profile: Profile) => {
    loadProfileData(profile);
  }, [loadProfileData]);

  const deleteProfile = (name: string) => {
    const updatedProfiles = profiles.filter(p => p.name !== name);
    localStorage.setItem('firebaseProfiles', JSON.stringify(updatedProfiles));
    setProfiles(current => current.filter(p => p.name !== name));
    if (activeProfile === name) {
      setActiveProfile(null);
      setConfig(null);
      setDb(null);
      setCollections([]);
      setLoadedCollections([]);
    }
    toast.success('Profile deleted successfully!');
  };

  const handleConfigSubmit = async (e: React.FormEvent, configOverride?: FirebaseConfig) => {
    e.preventDefault();
    try {
      const configToUse = configOverride || config;
      const app = initializeApp(configToUse!);
      const firestore = getFirestore(app);
      setDb(firestore);
      setCollections([]); // Reset collections when connecting
      toast.success('Firebase connected successfully!');
    } catch (error) {
      toast.error('Failed to connect to Firebase');
      console.error(error);
    }
  };

  const loadCollections = async () => {
    setLoading(true);
    try {
      if (!selectedCollection?.trim()) {
        toast.error('Please enter a collection name');
        setLoading(false);
        return;
      }
      const collections = await getDocs(collection(db, selectedCollection));
      const docs = collections.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (!loadedCollections.includes(selectedCollection)) {
        setLoadedCollections(prev => [...prev, selectedCollection]);
      }
      
      setCollections(current => {
        const existingIndex = current.findIndex(c => c.name === selectedCollection);
        if (existingIndex >= 0) {
          const updated = [...current];
          updated[existingIndex] = { name: selectedCollection, documents: docs };
          return updated;
        }
        return [...current, { name: selectedCollection, documents: docs }];
      });
      
      if (activeProfile) {
        setProfiles(current =>
          current.map(p => {
            if (p.name === activeProfile && !p.collections.includes(selectedCollection)) {
              return {
                ...p,
                collections: [...p.collections, selectedCollection]
              };
            }
            return p;
          })
        );
      }
      
      toast.success(`Collection "${selectedCollection}" loaded successfully!`);
      setShowLoadCollectionForm(false);
    } catch (error) {
      toast.error('Failed to load collections');
      console.error(error);
    }
    setLoading(false);
  };

  const createCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName || !newDocumentJson) {
      toast.error('Please provide both collection name and document JSON');
      return;
    }
    try {
      const json = JSON.parse(newDocumentJson);
      if (newDocumentId) {
        await setDoc(doc(db, newCollectionName, newDocumentId), json);
      } else {
        await addDoc(collection(db, newCollectionName), json);
      }
      toast.success('Collection created successfully!');
      
      if (activeProfile) {
        setProfiles(current => 
          current.map(p => 
            p.name === activeProfile 
              ? { ...p, collections: [...p.collections, newCollectionName] }
              : p
          )
        );
        setSelectedCollection(newCollectionName);
        loadCollections();
      }
      
      setNewCollectionName('');
      setNewDocumentJson('');
      setNewDocumentId('');
    } catch (error) {
      toast.error('Failed to create collection');
      console.error(error);
    }
  };

  const deleteDocument = async (collectionName: string, documentId: string) => {
    try {
      await deleteDoc(doc(db, collectionName, documentId));
      toast.success('Document deleted successfully!');
      await loadCollections();
    } catch (error) {
      toast.error('Failed to delete document');
      console.error(error);
    }
  };

  const addDocumentToCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollection || !newDocumentJsonForExisting) {
      toast.error('Please provide document JSON and collection name');
      return;
    }
    try {
      const json = JSON.parse(newDocumentJsonForExisting);
      if (newDocumentIdForExisting) {
        const docRef = doc(db, selectedCollection, newDocumentIdForExisting);
        await setDoc(docRef, json);
        toast.success(`Document created with ID: ${newDocumentIdForExisting}`);
      } else {
        const docRef = await addDoc(collection(db, selectedCollection), json);
        toast.success(`Document created with ID: ${docRef.id}`);
      }
      await loadCollections();
      setNewDocumentJsonForExisting('');
      setNewDocumentIdForExisting('');
      setShowAddDocumentForm(false);
    } catch (error) {
      toast.error('Failed to add document. Please check your JSON format.');
      console.error(error);
    }
  };

  const updateDocument = async (collectionName: string, documentId: string, newData: any) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      // Get current document data
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        // Merge current data with new data while preserving field order
        const mergedData = { ...currentData, ...newData };
        // Use setDoc with merge option to update the document
        await setDoc(docRef, mergedData, { merge: true });
      } else {
        await setDoc(docRef, newData);
      }
      toast.success('Document updated successfully!');
      await loadCollections();
    } catch (error) {
      toast.error('Failed to update document');
      console.error(error);
    }
  };

  const batchUpdateDocuments = async (collectionName: string, updates: Record<string, any>, selectedDocs: string[]) => {
    try {
      const batch = writeBatch(db);
      const docs = await Promise.all(
        selectedDocs.map(async (docId) => {
          const docRef = doc(db, collectionName, docId);
          const docSnap = await getDoc(docRef);
          return { ref: docRef, data: docSnap.data() };
        })
      );
      
      docs.forEach(({ ref, data }) => {
        const mergedData = { ...data, ...updates };
        batch.set(ref, mergedData, { merge: true });
      });
      
      await batch.commit();
      toast.success('Documents updated successfully!');
      await loadCollections();
    } catch (error) {
      toast.error('Failed to update documents');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
      <div className="flex min-h-screen">
        <Toaster position="top-right" />
        <ProfileModal
          show={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profileName={profileName}
          onProfileNameChange={setProfileName}
          onSave={saveProfile}
        />
        <Sidebar
          profiles={profiles}
          onLoadProfile={loadProfile}
          onDeleteProfile={deleteProfile}
          onCollectionSelect={handleCollectionSelect}
          onNewCollection={() => {
            setCollections([]);
            setShowLoadCollectionForm(false);
          }}
          onLoadCollectionForm={() => {
            setSelectedCollection(null);
            setShowLoadCollectionForm(true);
          }}
          onSaveProfile={() => setShowProfileModal(true)}
          db={db}
          activeProfile={activeProfile}
          selectedCollection={selectedCollection}
          onAboutClick={() => setShowAbout(true)}
          activeProfileCollections={loadedCollections}
        />
        <main className="flex-1 p-8 ml-64 dark:text-gray-100">
          {showAbout ? (
            <About />
          ) : !db ? (
            <FirebaseConnect
              config={config}
              configJson={configJson}
              onConfigChange={setConfig}
              onConfigJsonChange={setConfigJson}
              onSubmit={handleConfigSubmit}
            />
          ) : (
            <div className="space-y-6">
              {showLoadCollectionForm && (
                <CollectionForm
                  selectedCollection={selectedCollection}
                  onCollectionChange={setSelectedCollection}
                  onLoadCollections={loadCollections}
                  loading={loading}
                />
              )}

              {collections.length === 0 && !loading && !showLoadCollectionForm && (
                <CollectionForm
                  newCollectionName={newCollectionName}
                  newDocumentJson={newDocumentJson}
                  newDocumentId={newDocumentId}
                  onCollectionNameChange={setNewCollectionName}
                  onDocumentJsonChange={setNewDocumentJson}
                  onDocumentIdChange={setNewDocumentId}
                  onSubmit={createCollection}
                />
              )}

              {collections.length > 0 && (
                <DocumentViewer
                  collections={collections}
                  showAddForm={showAddDocumentForm}
                  onShowAddForm={setShowAddDocumentForm}
                  newDocumentId={newDocumentIdForExisting}
                  onNewDocumentIdChange={setNewDocumentIdForExisting}
                  newDocumentJson={newDocumentJsonForExisting}
                  onNewDocumentJsonChange={setNewDocumentJsonForExisting}
                  onAddDocument={addDocumentToCollection}
                  selectedDocument={selectedDocument}
                  onDocumentSelect={setSelectedDocument}
                  onDeleteDocument={deleteDocument}
                  onUpdateDocument={updateDocument}
                  onBatchUpdate={batchUpdateDocuments}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;