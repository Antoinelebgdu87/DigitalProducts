import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { License } from "@/types";

interface UseLicensesReturn {
  licenses: License[];
  isLoading: boolean;
  error: string | null;
  addLicense: (license: Omit<License, "id" | "createdAt">) => Promise<void>;
  deleteLicense: (licenseId: string) => Promise<void>;
  validateLicense: (
    key: string,
    productName: string,
  ) => Promise<{ isValid: boolean; user?: any; message?: string }>;
}

export const useLicenses = (): UseLicensesReturn => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Listen to real-time changes in Firebase
      const licensesRef = collection(db, "licenses");
      const q = query(licensesRef, orderBy("createdAt", "desc"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const licensesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            usedAt: data.usedAt?.toDate() || undefined,
          } as License;
        });
        
        setLicenses(licensesData);
        setIsLoading(false);
        setError(null);
        console.log("📄 Licenses chargées depuis Firebase:", licensesData.length);
      }, (error) => {
        console.error("Erreur lors du chargement des licenses:", error);
        setError("Erreur lors du chargement des licenses");
        setIsLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Erreur lors de l'initialisation des licenses:", error);
      setError("Erreur lors de l'initialisation");
      setIsLoading(false);
    }
  }, []);

  const addLicense = async (
    licenseData: Omit<License, "id" | "createdAt">,
  ): Promise<void> => {
    try {
      const newLicense = {
        ...licenseData,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "licenses"), newLicense);
      console.log("📄 License ajoutée dans Firebase:", licenseData.key);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la license:", error);
      throw new Error("Erreur lors de l'ajout de la license");
    }
  };

  const deleteLicense = async (licenseId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "licenses", licenseId));
      console.log("📄 License supprimée de Firebase:", licenseId);
    } catch (error) {
      console.error("Erreur lors de la suppression de la license:", error);
      throw new Error("Erreur lors de la suppression de la license");
    }
  };

  const validateLicense = async (
    key: string,
    productName: string,
  ): Promise<{ isValid: boolean; user?: any; message?: string }> => {
    try {
      // Find the license in our current data
      const license = licenses.find(
        (l) => l.key === key && l.productName === productName,
      );

      if (!license) {
        return {
          isValid: false,
          message: "License key not found for this product",
        };
      }

      if (license.isUsed) {
        return {
          isValid: false,
          message: "License key has already been used",
          user: license.usedBy,
        };
      }

      // Mark license as used in Firebase
      const licenseRef = doc(db, "licenses", license.id);
      await updateDoc(licenseRef, {
        isUsed: true,
        usedAt: Timestamp.now(),
        usedBy: "User", // You might want to pass actual user info here
      });

      console.log("📄 License validée et marquée comme utilisée:", key);

      return {
        isValid: true,
        message: "License key is valid and has been activated",
      };
    } catch (error) {
      console.error("Erreur lors de la validation de la license:", error);
      return {
        isValid: false,
        message: "Error validating license key",
      };
    }
  };

  return {
    licenses,
    isLoading,
    error,
    addLicense,
    deleteLicense,
    validateLicense,
  };
};
