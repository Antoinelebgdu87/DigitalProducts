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

// Firebase configuration - Configuration exacte fournie par l'utilisateur
const firebaseConfig = {
  apiKey: "AIzaSyDMsFeXMVm61NlmN8QBk7UmH1ngPFW8TWo",
  authDomain: "keysystem-d0b86.firebaseapp.com",
  projectId: "keysystem-d0b86",
  storageBucket: "keysystem-d0b86.firebasestorage.app",
  messagingSenderId: "1012783086146",
  appId: "1:1012783086146:web:25b791444539804f2a4bdb",
  measurementId: "G-LWKWR0VQKM"
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
