export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface Profile {
  name: string;
  config: FirebaseConfig;
  collections: string[];
}

export interface Collection {
  name: string;
  documents: any[];
}

export interface FilterConfig {
  field: string;
  value: string;
}