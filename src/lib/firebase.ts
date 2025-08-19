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

let app: any = null;
let db: any = null;
let analytics: any = null;

try {
  if (hasFirebaseConfig) {
    console.log("🚀 Initialisation Firebase en cours...");
    console.log("📋 Configuration:", {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      hasApiKey: !!firebaseConfig.apiKey,
    });

    // Initialize Firebase with the new configuration
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase App initialisé");

    db = getFirestore(app);
    console.log("✅ Firestore connecté");

    // Temporairement désactiver Analytics pour éviter les erreurs
    /*
    // Initialize Analytics if supported
    if (typeof window !== "undefined") {
      try {
        analytics = getAnalytics(app);
        console.log("📊 Firebase Analytics initialized");
      } catch (analyticsError) {
        console.warn("⚠️ Analytics initialization failed:", analyticsError);
      }
    }
    */

    console.log(
      "🔥 Firebase initialized successfully with project:",
      firebaseConfig.projectId,
    );
    console.log("🗄️ Firestore database connected");
  } else {
    console.warn(
      "⚠️ Firebase configuration not found. Running in offline mode with localStorage fallback.",
    );
  }
} catch (error: any) {
  console.error("❌ Firebase initialization failed:", error);
  console.error("❌ Error details:", {
    message: error.message,
    code: error.code,
    stack: error.stack
  });
  console.warn("🔄 Switching to localStorage fallback mode");

  // Force les variables à null pour être sûr
  app = null;
  db = null;
  analytics = null;
}

export { db, analytics };
export const isFirebaseAvailable = !!db && hasFirebaseConfig;

// Fonction de suppression sécurisée pour Firebase
export const safeDeleteDoc = async (docRef: any): Promise<boolean> => {
  if (!shouldUseFirebase()) {
    console.warn("🔄 Firebase non disponible - suppression en mode local uniquement");
    return false;
  }

  try {
    await deleteDoc(docRef);
    console.log("🗑️ Document supprimé avec succès de Firebase");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la suppression Firebase:", error);
    throw error;
  }
};

// Fonction pour vérifier l'existence d'un document avant suppression
export const checkDocumentExists = async (docRef: any): Promise<boolean> => {
  if (!shouldUseFirebase()) {
    return false;
  }

  try {
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du document:", error);
    return false;
  }
};

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
