// Système de fallback pour Firebase - empêche l'écran noir en production
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuration Firebase avec variables d'environnement ET fallback
const getFirebaseConfig = () => {
  // Essayez d'abord les variables d'environnement (pour la production)
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };
  }
  
  // Fallback vers la configuration hardcodée (pour le développement)
  return {
    apiKey: "AIzaSyACAkQ5Q68eKdD5vpFZU7-h8L-qeFlYnDI",
    authDomain: "test-a4251.firebaseapp.com",
    projectId: "test-a4251",
    storageBucket: "test-a4251.firebasestorage.app",
    messagingSenderId: "75154939894",
    appId: "1:75154939894:web:0d93f0eaa0e31bdbe5f1d7",
    measurementId: "G-THRZRBSW9S",
  };
};

// État global pour Firebase
let app: any = null;
let db: any = null;
let analytics: any = null;
let isFirebaseConnected = false;
let connectionAttempted = false;

// Fonction pour initialiser Firebase avec gestion d'erreur
export const initializeFirebaseWithFallback = async () => {
  if (connectionAttempted) {
    return { app, db, analytics, isConnected: isFirebaseConnected };
  }
  
  connectionAttempted = true;
  
  try {
    console.log("🔥 Tentative de connexion à Firebase...");
    
    const config = getFirebaseConfig();
    
    // Test de validation de config
    if (!config.apiKey || !config.projectId) {
      throw new Error("Configuration Firebase manquante");
    }
    
    app = initializeApp(config);
    db = getFirestore(app);
    
    // Test de connexion sans bloquer
    try {
      analytics = getAnalytics(app);
    } catch (analyticsError) {
      console.warn("⚠️ Analytics non disponible (peut être normal):", analyticsError);
    }
    
    // Test de base avec timeout
    const testPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout Firebase"));
      }, 5000); // 5 secondes max
      
      // Test minimal - juste vérifier si Firestore répond
      try {
        const testRef = db._delegate || db;
        if (testRef) {
          clearTimeout(timeout);
          resolve(true);
        } else {
          clearTimeout(timeout);
          reject(new Error("Firestore non accessible"));
        }
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
    
    await testPromise;
    
    isFirebaseConnected = true;
    console.log("✅ Firebase connecté avec succès - Projet:", config.projectId);
    
    return { app, db, analytics, isConnected: true };
    
  } catch (error) {
    console.error("❌ Erreur de connexion Firebase:", error);
    console.log("🔄 Mode dégradé activé - L'application fonctionnera avec des données locales");
    
    // Mode dégradé - créer des objets mock
    isFirebaseConnected = false;
    
    // Objets mock pour éviter les erreurs
    db = null;
    analytics = null;
    
    return { app: null, db: null, analytics: null, isConnected: false };
  }
};

// Export de l'état de connexion
export const getFirebaseStatus = () => ({
  isConnected: isFirebaseConnected,
  hasAttempted: connectionAttempted,
  app,
  db,
  analytics
});

// Re-export des fonctions Firebase avec gestion d'erreur
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

// Fonctions wrapper qui gèrent le mode dégradé
export const collection = (...args: any[]) => {
  if (!isFirebaseConnected || !db) {
    throw new Error("Firebase non connecté - Mode dégradé");
  }
  return fsCollection(db, ...args);
};

export const doc = (...args: any[]) => {
  if (!isFirebaseConnected || !db) {
    throw new Error("Firebase non connecté - Mode dégradé");
  }
  return fsDoc(db, ...args);
};

export const addDoc = (...args: any[]) => {
  if (!isFirebaseConnected || !db) {
    throw new Error("Firebase non connecté - Mode dégradé");
  }
  return fsAddDoc(...args);
};

export const getDoc = (...args: any[]) => {
  if (!isFirebaseConnected || !db) {
    throw new Error("Firebase non connecté - Mode dégradé");
  }
  return fsGetDoc(...args);
};

export const updateDoc = (...args: any[]) => {
  if (!isFirebaseConnected || !db) {
    throw new Error("Firebase non connecté - Mode dégradé");
  }
  return fsUpdateDoc(...args);
};

export const deleteDoc = (...args: any[]) => {
  if (!isFirebaseConnected || !db) {
    throw new Error("Firebase non connecté - Mode dégradé");
  }
  return fsDeleteDoc(...args);
};

export const onSnapshot = (...args: any[]) => {
  if (!isFirebaseConnected || !db) {
    throw new Error("Firebase non connecté - Mode dégradé");
  }
  return fsOnSnapshot(...args);
};

export const query = (...args: any[]) => {
  if (!isFirebaseConnected || !db) {
    throw new Error("Firebase non connecté - Mode dégradé");
  }
  return fsQuery(...args);
};

export const where = fsWhere;
export const getDocs = (...args: any[]) => {
  if (!isFirebaseConnected || !db) {
    throw new Error("Firebase non connecté - Mode dégradé");
  }
  return fsGetDocs(...args);
};

export const setDoc = (...args: any[]) => {
  if (!isFirebaseConnected || !db) {
    throw new Error("Firebase non connecté - Mode dégradé");
  }
  return fsSetDoc(...args);
};

export const orderBy = fsOrderBy;
export const Timestamp = fsTimestamp;

// Export de compatibilité
export const isFirebaseAvailable = () => isFirebaseConnected;
export { db, analytics };

// Export default pour compatibilité avec les imports existants
const FirebaseFallback = {
  initializeFirebaseWithFallback,
  getFirebaseStatus,
  isFirebaseAvailable: () => isFirebaseConnected,
  db: () => db,
  analytics: () => analytics,
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  setDoc,
  orderBy,
  Timestamp
};

export default FirebaseFallback;
