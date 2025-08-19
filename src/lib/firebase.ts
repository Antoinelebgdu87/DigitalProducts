import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
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
  Timestamp as fsTimestamp,
  setDoc as fsSetDoc,
  orderBy as fsOrderBy,
} from "firebase/firestore";

// Firebase configuration - Configuration mise à jour avec le projet test-a4251
const firebaseConfig = {
  apiKey: "AIzaSyACAkQ5Q68eKdD5vpFZU7-h8L-qeFlYnDI",
  authDomain: "test-a4251.firebaseapp.com",
  projectId: "test-a4251",
  storageBucket: "test-a4251.firebasestorage.app",
  messagingSenderId: "75154939894",
  appId: "1:75154939894:web:0d93f0eaa0e31bdbe5f1d7",
  measurementId: "G-THRZRBSW9S"
};

// Firebase sera toujours utilisé avec cette configuration
const hasFirebaseConfig = true;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

console.log("🔥 Firebase initialized with project:", firebaseConfig.projectId);
console.log("🗄️ Firestore database connected");
console.log("📊 Firebase Analytics initialized");

export { db, analytics };
export const isFirebaseAvailable = true;

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
export const setDoc = fsSetDoc;
export const orderBy = fsOrderBy;
