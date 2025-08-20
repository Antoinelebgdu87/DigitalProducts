import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  DocumentReference,
  Query,
  FirestoreError,
} from "firebase/firestore";
import FirebaseFallback from "./firebase-fallback";

// Firebase service avec retry logic et gestion d'erreur
export class FirebaseService {
  private static retryDelay = 1000;
  private static maxRetries = 3;

  static async withRetry<T>(
    operation: () => Promise<T>,
    retries = this.maxRetries,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        console.warn(
          `Firebase operation failed, retrying... (${retries} left)`,
          error,
        );
        await this.delay(this.retryDelay);
        return this.withRetry(operation, retries - 1);
      }
      throw error;
    }
  }

  private static isRetryableError(error: any): boolean {
    // Network errors, timeout errors, etc.
    return (
      error?.code === "unavailable" ||
      error?.code === "deadline-exceeded" ||
      error?.message?.includes("Failed to fetch") ||
      error?.message?.includes("network") ||
      error?.name === "TypeError"
    );
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getDocument(docRef: DocumentReference) {
    return this.withRetry(async () => {
      const doc = await getDoc(docRef);
      return doc;
    });
  }

  static async setDocument(docRef: DocumentReference, data: any) {
    return this.withRetry(async () => {
      await setDoc(docRef, data);
    });
  }

  static async updateDocument(docRef: DocumentReference, data: any) {
    return this.withRetry(async () => {
      await updateDoc(docRef, data);
    });
  }

  static createListener(
    docRef: DocumentReference | Query,
    onNext: (snapshot: any) => void,
    onError?: (error: FirestoreError) => void,
  ) {
    const errorHandler = (error: FirestoreError) => {
      console.error("Firebase listener error:", error);
      if (onError) {
        onError(error);
      } else {
        // Default error handling - try to reconnect after delay
        setTimeout(() => {
          console.log("Attempting to reconnect Firebase listener...");
          this.createListener(docRef, onNext, onError);
        }, this.retryDelay);
      }
    };

    try {
      return onSnapshot(docRef, onNext, errorHandler);
    } catch (error) {
      console.error("Failed to create Firebase listener:", error);
      errorHandler(error as FirestoreError);
      return () => {}; // Return empty unsubscribe function
    }
  }

  static isOffline(): boolean {
    return !navigator.onLine;
  }

  static async waitForOnline(): Promise<void> {
    if (this.isOffline()) {
      return new Promise((resolve) => {
        const handler = () => {
          window.removeEventListener("online", handler);
          resolve();
        };
        window.addEventListener("online", handler);
      });
    }
  }
}
