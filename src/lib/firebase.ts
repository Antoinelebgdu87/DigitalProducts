import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Check if we're in development and should use mock
const USE_MOCK = true; // Set to false when you have proper Firebase web config

// Mock Firebase implementation
class MockDoc {
  constructor(public id: string, public data: any) {}
  
  exists() {
    return true;
  }
  
  data() {
    return this.data;
  }
}

class MockCollection {
  private storageKey: string;
  private listeners: Map<string, (snapshot: any) => void> = new Map();

  constructor(collectionName: string) {
    this.storageKey = `mock_firebase_${collectionName}`;
  }

  private getDocs(): MockDoc[] {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => new MockDoc(item.id, item.data));
    } catch {
      return [];
    }
  }

  private saveDocs(docs: MockDoc[]) {
    const serializable = docs.map(doc => ({ id: doc.id, data: doc.data }));
    localStorage.setItem(this.storageKey, JSON.stringify(serializable));
    this.notifyListeners(docs);
  }

  private notifyListeners(docs: MockDoc[]) {
    this.listeners.forEach(callback => {
      const snapshot = {
        docs: docs,
        empty: docs.length === 0
      };
      callback(snapshot);
    });
  }

  async addDoc(data: any) {
    const docs = this.getDocs();
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newDoc = new MockDoc(id, {
      ...data,
      createdAt: new Date(),
      lastSeen: new Date()
    });
    docs.push(newDoc);
    this.saveDocs(docs);
    return { id };
  }

  async getDoc(id: string) {
    const docs = this.getDocs();
    const doc = docs.find(d => d.id === id);
    return {
      id,
      exists: () => !!doc,
      data: () => doc?.data || null
    };
  }

  async updateDoc(id: string, updates: any) {
    const docs = this.getDocs();
    const docIndex = docs.findIndex(d => d.id === id);
    if (docIndex >= 0) {
      docs[docIndex].data = { ...docs[docIndex].data, ...updates };
      this.saveDocs(docs);
    }
  }

  async deleteDoc(id: string) {
    const docs = this.getDocs();
    const filteredDocs = docs.filter(d => d.id !== id);
    this.saveDocs(filteredDocs);
  }

  onSnapshot(callback: (snapshot: any) => void) {
    const listenerId = Math.random().toString(36);
    this.listeners.set(listenerId, callback);
    
    // Call immediately with current data
    this.notifyListeners(this.getDocs());

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listenerId);
    };
  }

  where(field: string, operator: string, value: any) {
    return {
      get: async () => {
        const docs = this.getDocs();
        const filtered = docs.filter(doc => {
          const fieldValue = doc.data[field];
          switch (operator) {
            case '==': return fieldValue === value;
            case '!=': return fieldValue !== value;
            case '>': return fieldValue > value;
            case '<': return fieldValue < value;
            case '>=': return fieldValue >= value;
            case '<=': return fieldValue <= value;
            default: return false;
          }
        });
        return {
          empty: filtered.length === 0,
          docs: filtered
        };
      }
    };
  }
}

class MockFirestore {
  private collections: Map<string, MockCollection> = new Map();

  collection(name: string) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MockCollection(name));
    }
    return this.collections.get(name)!;
  }

  doc(collectionName: string, docId: string) {
    const collection = this.collection(collectionName);
    return {
      get: () => collection.getDoc(docId),
      update: (data: any) => collection.updateDoc(docId, data),
      delete: () => collection.deleteDoc(docId),
      onSnapshot: (callback: any) => {
        const unsubscribe = collection.onSnapshot((snapshot) => {
          const doc = snapshot.docs.find((d: any) => d.id === docId);
          if (doc) {
            callback(doc);
          } else {
            callback({
              exists: () => false,
              data: () => null,
              id: docId
            });
          }
        });
        return unsubscribe;
      }
    };
  }
}

// Web app Firebase configuration (placeholder - needs real web app config)
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
  // Use mock Firebase for development
  db = new MockFirestore();
  console.log("🔧 Using Mock Firebase for development");
} else {
  // Use real Firebase
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

// Mock Firebase functions that match the real API
export { db };

export const collection = (database: any, collectionName: string) => {
  if (USE_MOCK) {
    return database.collection(collectionName);
  } else {
    const { collection: realCollection } = require("firebase/firestore");
    return realCollection(database, collectionName);
  }
};

export const doc = (database: any, collectionName: string, docId: string) => {
  if (USE_MOCK) {
    return database.doc(collectionName, docId);
  } else {
    const { doc: realDoc } = require("firebase/firestore");
    return realDoc(database, collectionName, docId);
  }
};

export const addDoc = async (collectionRef: any, data: any) => {
  if (USE_MOCK) {
    return await collectionRef.addDoc(data);
  } else {
    const { addDoc: realAddDoc } = require("firebase/firestore");
    return await realAddDoc(collectionRef, data);
  }
};

export const getDoc = async (docRef: any) => {
  if (USE_MOCK) {
    return await docRef.get();
  } else {
    const { getDoc: realGetDoc } = require("firebase/firestore");
    return await realGetDoc(docRef);
  }
};

export const updateDoc = async (docRef: any, data: any) => {
  if (USE_MOCK) {
    return await docRef.update(data);
  } else {
    const { updateDoc: realUpdateDoc } = require("firebase/firestore");
    return await realUpdateDoc(docRef, data);
  }
};

export const deleteDoc = async (docRef: any) => {
  if (USE_MOCK) {
    return await docRef.delete();
  } else {
    const { deleteDoc: realDeleteDoc } = require("firebase/firestore");
    return await realDeleteDoc(docRef);
  }
};

export const onSnapshot = (ref: any, callback: any) => {
  if (USE_MOCK) {
    return ref.onSnapshot(callback);
  } else {
    const { onSnapshot: realOnSnapshot } = require("firebase/firestore");
    return realOnSnapshot(ref, callback);
  }
};

export const query = (collectionRef: any, ...constraints: any[]) => {
  if (USE_MOCK) {
    // For mock, return the collection ref itself (simplified)
    return collectionRef;
  } else {
    const { query: realQuery } = require("firebase/firestore");
    return realQuery(collectionRef, ...constraints);
  }
};

export const where = (field: string, operator: string, value: any) => {
  if (USE_MOCK) {
    return { field, operator, value };
  } else {
    const { where: realWhere } = require("firebase/firestore");
    return realWhere(field, operator, value);
  }
};

export const getDocs = async (queryRef: any) => {
  if (USE_MOCK) {
    return await queryRef.where('', '==', '').get(); // This is a hack for mock
  } else {
    const { getDocs: realGetDocs } = require("firebase/firestore");
    return await realGetDocs(queryRef);
  }
};

export const Timestamp = {
  now: () => new Date(),
  fromDate: (date: Date) => date
};
