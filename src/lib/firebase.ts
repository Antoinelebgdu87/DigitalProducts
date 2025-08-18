import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Web app Firebase configuration (not service account)
const firebaseConfig = {
  apiKey: "AIzaSyBGX8nLq7yPYDqpvSHxXzBUfH9UNjWy1Zc",
  authDomain: "keysystem-d0b86.firebaseapp.com",
  projectId: "keysystem-d0b86",
  storageBucket: "keysystem-d0b86.firebasestorage.app",
  messagingSenderId: "103545005750398754258",
  appId: "1:103545005750398754258:web:abc123def456ghi789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
