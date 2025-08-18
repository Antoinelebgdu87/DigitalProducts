import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Use mock for development to avoid connection issues
const USE_MOCK = true;

// Simple in-memory mock database
class MockDatabase {
  private data: { [collection: string]: { [id: string]: any } } = {};
  private listeners: { [path: string]: ((data: any) => void)[] } = {};

  // Get collection data
  getCollection(name: string) {
    if (!this.data[name]) {
      this.data[name] = {};
    }
    return this.data[name];
  }

  // Add document
  addDoc(collectionName: string, data: any) {
    const collection = this.getCollection(collectionName);
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    collection[id] = {
      ...data,
      createdAt: new Date(),
      lastSeen: new Date()
    };
    
    this.notifyListeners(collectionName);
    return { id };
  }

  // Get document
  getDoc(collectionName: string, id: string) {
    const collection = this.getCollection(collectionName);
    const doc = collection[id];
    
    return {
      id,
      exists: () => !!doc,
      data: () => doc || null
    };
  }

  // Update document
  updateDoc(collectionName: string, id: string, updates: any) {
    const collection = this.getCollection(collectionName);
    if (collection[id]) {
      collection[id] = { ...collection[id], ...updates };
      this.notifyListeners(collectionName);
      this.notifyListeners(`${collectionName}/${id}`);
    }
  }

  // Delete document
  deleteDoc(collectionName: string, id: string) {
    const collection = this.getCollection(collectionName);
    delete collection[id];
    this.notifyListeners(collectionName);
  }

  // Get all docs
  getDocs(collectionName: string) {
    const collection = this.getCollection(collectionName);
    const docs = Object.entries(collection).map(([id, data]) => ({
      id,
      data: () => data,
      exists: () => true
    }));
    
    return {
      docs,
      empty: docs.length === 0
    };
  }

  // Query with where clause
  queryWhere(collectionName: string, field: string, operator: string, value: any) {
    const collection = this.getCollection(collectionName);
    const docs = Object.entries(collection)
      .filter(([id, data]) => {
        const fieldValue = data[field];
        switch (operator) {
          case '==': return fieldValue === value;
          case '!=': return fieldValue !== value;
          case '>': return fieldValue > value;
          case '<': return fieldValue < value;
          case '>=': return fieldValue >= value;
          case '<=': return fieldValue <= value;
          default: return false;
        }
      })
      .map(([id, data]) => ({
        id,
        data: () => data,
        exists: () => true
      }));
    
    return {
      docs,
      empty: docs.length === 0
    };
  }

  // Listen to changes
  onSnapshot(path: string, callback: (data: any) => void) {
    if (!this.listeners[path]) {
      this.listeners[path] = [];
    }
    this.listeners[path].push(callback);

    // Immediately call with current data
    if (path.includes('/')) {
      // Document listener
      const [collectionName, docId] = path.split('/');
      const doc = this.getDoc(collectionName, docId);
      callback(doc);
    } else {
      // Collection listener
      const snapshot = this.getDocs(path);
      callback(snapshot);
    }

    // Return unsubscribe function
    return () => {
      if (this.listeners[path]) {
        const index = this.listeners[path].indexOf(callback);
        if (index > -1) {
          this.listeners[path].splice(index, 1);
        }
      }
    };
  }

  // Notify listeners
  private notifyListeners(path: string) {
    if (this.listeners[path]) {
      this.listeners[path].forEach(callback => {
        if (path.includes('/')) {
          // Document listener
          const [collectionName, docId] = path.split('/');
          const doc = this.getDoc(collectionName, docId);
          callback(doc);
        } else {
          // Collection listener
          const snapshot = this.getDocs(path);
          callback(snapshot);
        }
      });
    }
  }
}

// Global mock database instance
const mockDB = new MockDatabase();

// Web app Firebase configuration (placeholder)
const firebaseConfig = {
  apiKey: "AIzaSyBGX8nLq7yPYDqpvSHxXzBUfH9UNjWy1Zc",
  authDomain: "keysystem-d0b86.firebaseapp.com",
  projectId: "keysystem-d0b86",
  storageBucket: "keysystem-d0b86.firebasestorage.app",
  messagingSenderId: "103545005750398754258",
  appId: "1:103545005750398754258:web:abc123def456ghi789"
};

let db: any;

if (USE_MOCK) {
  // Mock database that mimics Firestore behavior
  db = { _mock: true };
  console.log("🔧 Using Mock Firebase for development");
} else {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

// Mock Firebase functions
export { db };

export const collection = (database: any, collectionName: string) => {
  if (USE_MOCK) {
    return {
      _collection: collectionName,
      _isMockCollection: true
    };
  } else {
    const { collection: realCollection } = require("firebase/firestore");
    return realCollection(database, collectionName);
  }
};

export const doc = (database: any, collectionName: string, docId: string) => {
  if (USE_MOCK) {
    return {
      _collection: collectionName,
      _docId: docId,
      _isMockDoc: true
    };
  } else {
    const { doc: realDoc } = require("firebase/firestore");
    return realDoc(database, collectionName, docId);
  }
};

export const addDoc = async (collectionRef: any, data: any) => {
  if (USE_MOCK && collectionRef._isMockCollection) {
    return mockDB.addDoc(collectionRef._collection, data);
  } else {
    const { addDoc: realAddDoc } = require("firebase/firestore");
    return await realAddDoc(collectionRef, data);
  }
};

export const getDoc = async (docRef: any) => {
  if (USE_MOCK && docRef._isMockDoc) {
    return mockDB.getDoc(docRef._collection, docRef._docId);
  } else {
    const { getDoc: realGetDoc } = require("firebase/firestore");
    return await realGetDoc(docRef);
  }
};

export const updateDoc = async (docRef: any, data: any) => {
  if (USE_MOCK && docRef._isMockDoc) {
    return mockDB.updateDoc(docRef._collection, docRef._docId, data);
  } else {
    const { updateDoc: realUpdateDoc } = require("firebase/firestore");
    return await realUpdateDoc(docRef, data);
  }
};

export const deleteDoc = async (docRef: any) => {
  if (USE_MOCK && docRef._isMockDoc) {
    return mockDB.deleteDoc(docRef._collection, docRef._docId);
  } else {
    const { deleteDoc: realDeleteDoc } = require("firebase/firestore");
    return await realDeleteDoc(docRef);
  }
};

export const onSnapshot = (ref: any, callback: any) => {
  if (USE_MOCK) {
    if (ref._isMockCollection) {
      return mockDB.onSnapshot(ref._collection, callback);
    } else if (ref._isMockDoc) {
      return mockDB.onSnapshot(`${ref._collection}/${ref._docId}`, callback);
    }
  } else {
    const { onSnapshot: realOnSnapshot } = require("firebase/firestore");
    return realOnSnapshot(ref, callback);
  }
};

export const query = (collectionRef: any, ...constraints: any[]) => {
  if (USE_MOCK) {
    return {
      ...collectionRef,
      _constraints: constraints,
      _isMockQuery: true
    };
  } else {
    const { query: realQuery } = require("firebase/firestore");
    return realQuery(collectionRef, ...constraints);
  }
};

export const where = (field: string, operator: string, value: any) => {
  return { field, operator, value, _isMockWhere: true };
};

export const getDocs = async (queryRef: any) => {
  if (USE_MOCK && queryRef._isMockQuery) {
    // Handle where constraints
    const whereConstraint = queryRef._constraints?.find((c: any) => c._isMockWhere);
    if (whereConstraint) {
      return mockDB.queryWhere(
        queryRef._collection, 
        whereConstraint.field, 
        whereConstraint.operator, 
        whereConstraint.value
      );
    }
    return mockDB.getDocs(queryRef._collection);
  } else {
    const { getDocs: realGetDocs } = require("firebase/firestore");
    return await realGetDocs(queryRef);
  }
};

export const Timestamp = {
  now: () => new Date(),
  fromDate: (date: Date) => date
};
