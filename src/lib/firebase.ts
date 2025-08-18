import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  collection as fsCollection,
  doc as fsDoc,
  addDoc as fsAddDoc,
  getDoc as fsGetDoc,
  updateDoc as fsUpdateDoc,
  deleteDoc as fsDeleteDoc,
  onSnapshot as fsOnSnapshot,
  query as fsQuery,
  where as fsWhere,
  getDocs as fsGetDocs,
  Timestamp as fsTimestamp
} from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("🔥 Firebase initialized with project:", firebaseConfig.projectId);

// Export Firebase functions directly
export const collection = fsCollection;
export const doc = fsDoc;
export const addDoc = fsAddDoc;
export const getDoc = fsGetDoc;
export const updateDoc = fsUpdateDoc;
export const deleteDoc = fsDeleteDoc;
export const onSnapshot = fsOnSnapshot;
export const query = fsQuery;
export const where = fsWhere;
export const getDocs = fsGetDocs;
export const Timestamp = fsTimestamp;
