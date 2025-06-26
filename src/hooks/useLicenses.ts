import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { License } from "@/types";

export const useLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLicenses = async () => {
    try {
      const q = query(collection(db, "licenses"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const licensesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate() || new Date(),
      })) as License[];
      setLicenses(licensesData);
    } catch (error) {
      console.error("Error fetching licenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const generateLicenseCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) result += "-";
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createLicense = async (
    productId: string,
    expiresAt: Date,
  ): Promise<string> => {
    try {
      const code = generateLicenseCode();
      await addDoc(collection(db, "licenses"), {
        productId,
        code,
        expiresAt,
        createdAt: new Date(),
        isUsed: false,
      });
      await fetchLicenses(); // Refresh the list
      return code;
    } catch (error) {
      console.error("Error creating license:", error);
      throw error;
    }
  };

  const deleteLicense = async (licenseId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "licenses", licenseId));
      await fetchLicenses(); // Refresh the list
    } catch (error) {
      console.error("Error deleting license:", error);
      throw error;
    }
  };

  const validateLicense = async (
    licenseCode: string,
    productId: string,
  ): Promise<boolean> => {
    try {
      const q = query(
        collection(db, "licenses"),
        where("code", "==", licenseCode),
        where("productId", "==", productId),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return false;

      const license = querySnapshot.docs[0].data() as License;
      const now = new Date();
      const expiresAt = license.expiresAt.toDate
        ? license.expiresAt.toDate()
        : new Date(license.expiresAt);

      return expiresAt > now && !license.isUsed;
    } catch (error) {
      console.error("Error validating license:", error);
      return false;
    }
  };

  const getActiveLicenses = (): License[] => {
    const now = new Date();
    return licenses.filter((license) => {
      const expiresAt =
        license.expiresAt instanceof Date
          ? license.expiresAt
          : new Date(license.expiresAt);
      return expiresAt > now && !license.isUsed;
    });
  };

  return {
    licenses,
    loading,
    createLicense,
    deleteLicense,
    validateLicense,
    getActiveLicenses,
    refetch: fetchLicenses,
  };
};
