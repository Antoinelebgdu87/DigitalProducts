import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { mockDb, mockFirebaseFunctions } from "./mockFirebase";

// Check if we're in development and should use mock
const USE_MOCK = true; // Set to false when you have proper Firebase web config

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
let firestoreFunctions: any;

if (USE_MOCK) {
  // Use mock Firebase for development
  db = mockDb;
  firestoreFunctions = mockFirebaseFunctions;
  console.log("🔧 Using Mock Firebase for development");
} else {
  // Use real Firebase
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  firestoreFunctions = {
    collection: require("firebase/firestore").collection,
    doc: require("firebase/firestore").doc,
    addDoc: require("firebase/firestore").addDoc,
    getDoc: require("firebase/firestore").getDoc,
    updateDoc: require("firebase/firestore").updateDoc,
    deleteDoc: require("firebase/firestore").deleteDoc,
    onSnapshot: require("firebase/firestore").onSnapshot,
    query: require("firebase/firestore").query,
    where: require("firebase/firestore").where,
    getDocs: require("firebase/firestore").getDocs,
    Timestamp: require("firebase/firestore").Timestamp
  };
}

// Export db and all Firestore functions
export { db };
export const {
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
  Timestamp
} = firestoreFunctions;
