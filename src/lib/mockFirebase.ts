// Mock Firebase service for local development
// This provides the same interface as Firestore but uses localStorage

interface MockDoc {
  id: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

class MockCollection {
  private storageKey: string;
  private listeners: Map<string, (docs: MockDoc[]) => void> = new Map();

  constructor(collectionName: string) {
    this.storageKey = `mock_firebase_${collectionName}`;
  }

  private getDocs(): MockDoc[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveDocs(docs: MockDoc[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(docs));
    // Notify listeners
    this.listeners.forEach(callback => callback(docs));
  }

  async addDoc(data: any): Promise<{ id: string }> {
    const docs = this.getDocs();
    const newDoc: MockDoc = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      data: { ...data, createdAt: new Date(), lastSeen: new Date() },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    docs.push(newDoc);
    this.saveDocs(docs);
    return { id: newDoc.id };
  }

  async getDoc(id: string): Promise<{ exists: () => boolean; data: () => any; id: string }> {
    const docs = this.getDocs();
    const doc = docs.find(d => d.id === id);
    return {
      exists: () => !!doc,
      data: () => doc?.data || {},
      id
    };
  }

  async updateDoc(id: string, updates: any): Promise<void> {
    const docs = this.getDocs();
    const docIndex = docs.findIndex(d => d.id === id);
    if (docIndex >= 0) {
      docs[docIndex].data = { ...docs[docIndex].data, ...updates };
      docs[docIndex].updatedAt = new Date();
      this.saveDocs(docs);
    }
  }

  async deleteDoc(id: string): Promise<void> {
    const docs = this.getDocs();
    const filteredDocs = docs.filter(d => d.id !== id);
    this.saveDocs(filteredDocs);
  }

  onSnapshot(callback: (snapshot: any) => void): () => void {
    const listenerId = Math.random().toString(36);
    
    const wrappedCallback = (docs: MockDoc[]) => {
      const snapshot = {
        docs: docs.map(doc => ({
          id: doc.id,
          data: () => doc.data,
          exists: () => true
        }))
      };
      callback(snapshot);
    };

    this.listeners.set(listenerId, wrappedCallback);
    
    // Call immediately with current data
    wrappedCallback(this.getDocs());

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
            case '==':
              return fieldValue === value;
            case '!=':
              return fieldValue !== value;
            case '>':
              return fieldValue > value;
            case '<':
              return fieldValue < value;
            case '>=':
              return fieldValue >= value;
            case '<=':
              return fieldValue <= value;
            default:
              return false;
          }
        });
        return {
          empty: filtered.length === 0,
          docs: filtered.map(doc => ({
            id: doc.id,
            data: () => doc.data
          }))
        };
      }
    };
  }
}

class MockFirestore {
  private collections: Map<string, MockCollection> = new Map();

  collection(name: string): MockCollection {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MockCollection(name));
    }
    return this.collections.get(name)!;
  }

  doc(path: string) {
    const [collectionName, docId] = path.split('/');
    const collection = this.collection(collectionName);
    return {
      get: () => collection.getDoc(docId),
      update: (data: any) => collection.updateDoc(docId, data),
      delete: () => collection.deleteDoc(docId),
      onSnapshot: (callback: any) => {
        const unsubscribe = collection.onSnapshot((snapshot) => {
          const doc = snapshot.docs.find((d: any) => d.id === docId);
          if (doc) {
            callback({
              exists: () => true,
              data: doc.data,
              id: docId
            });
          }
        });
        return unsubscribe;
      }
    };
  }
}

// Mock Firebase functions
export const mockDb = new MockFirestore();

export const mockFirebaseFunctions = {
  collection: (name: string) => mockDb.collection(name),
  doc: (db: any, collection: string, id: string) => mockDb.doc(`${collection}/${id}`),
  addDoc: (collection: MockCollection, data: any) => collection.addDoc(data),
  getDoc: (docRef: any) => docRef.get(),
  updateDoc: (docRef: any, data: any) => docRef.update(data),
  deleteDoc: (docRef: any) => docRef.delete(),
  onSnapshot: (ref: any, callback: any) => ref.onSnapshot(callback),
  query: (collection: MockCollection, ...constraints: any[]) => collection,
  where: (field: string, operator: string, value: any) => ({ field, operator, value }),
  getDocs: (queryRef: any) => queryRef.get(),
  Timestamp: {
    now: () => new Date(),
    fromDate: (date: Date) => date
  }
};
