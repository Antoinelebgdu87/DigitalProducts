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
  Timestamp as fsTimestamp,
  setDoc as fsSetDoc,
  orderBy as fsOrderBy,
} from "firebase/firestore";

// Check if Firebase environment variables are available
const hasFirebaseConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
};

let app: any = null;
let db: any = null;

try {
  if (hasFirebaseConfig) {
    // Initialize Firebase only if config is available
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log(
      "🔥 Firebase initialized with project:",
      firebaseConfig.projectId,
    );
  } else {
    console.warn(
      "⚠️ Firebase configuration not found. Running in offline mode with localStorage fallback.",
    );
  }
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  console.warn("🔄 Switching to localStorage fallback mode");
}

export { db };
export const isFirebaseAvailable = !!db && hasFirebaseConfig;

// Export Firebase functions with fallback handling
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

// Helper function to check if Firebase operations should proceed
export const shouldUseFirebase = () => {
  return isFirebaseAvailable && db !== null;
};

// Mock Firestore functions for fallback mode
export const createMockFirestoreError = () => {
  throw new Error("Firebase not configured - using localStorage fallback");
};

// Safe Firebase operations that handle offline mode
export const safeFirebaseOperation = async (
  operation: () => Promise<any>,
  fallback?: () => any,
) => {
  if (!shouldUseFirebase()) {
    if (fallback) {
      return fallback();
    }
    console.warn("🔄 Firebase operation skipped - using fallback");
    return null;
  }

  try {
    return await operation();
  } catch (error) {
    console.error("❌ Firebase operation failed:", error);
    if (fallback) {
      console.warn("🔄 Using fallback after Firebase error");
      return fallback();
    }
    throw error;
  }
};
