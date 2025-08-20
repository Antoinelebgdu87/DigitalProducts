// ⚠️ DEPRECATED - Utilisez firebase-fallback.ts à la place
// Ce fichier reste pour la compatibilité mais redirige vers le nouveau système

console.warn("⚠️ firebase.ts est deprecated - utilisez firebase-fallback.ts pour un meilleur error handling");

// Re-export tout depuis le nouveau système de fallback
export {
  db,
  analytics,
  isFirebaseAvailable,
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
  Timestamp,
  setDoc,
  orderBy,
  initializeFirebaseWithFallback,
  getFirebaseStatus
} from "./firebase-fallback";
