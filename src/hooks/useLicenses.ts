import { useState, useEffect } from "react";
// Temporarily comment out Firebase imports to debug
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   orderBy,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";
import { License } from "@/types";

export const useLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLicenses = async () => {
    try {
      // Load from localStorage instead of Firebase
      const stored = localStorage.getItem("licenses");
      if (stored) {
        const licensesData = JSON.parse(stored) as License[];
        // Convert date strings back to Date objects
        const parsedLicenses = licensesData.map(license => ({
          ...license,
          createdAt: new Date(license.createdAt)
        }));
        setLicenses(parsedLicenses);
      } else {
        setLicenses([]);
      }
    } catch (error) {
      console.error("Error fetching licenses:", error);
      setLicenses([]);
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
    category: "compte" | "carte-cadeau" | "cheat",
    maxUsages: number,
  ): Promise<string> => {
    try {
      const code = generateLicenseCode();
      await addDoc(collection(db, "licenses"), {
        productId,
        code,
        category,
        maxUsages,
        currentUsages: 0,
        createdAt: new Date(),
        isActive: true,
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
  ): Promise<{ isValid: boolean; license?: License }> => {
    try {
      const q = query(
        collection(db, "licenses"),
        where("code", "==", licenseCode),
        where("productId", "==", productId),
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return { isValid: false };

      const licenseDoc = querySnapshot.docs[0];
      const license = licenseDoc.data() as License;

      const isValid =
        license.isActive && license.currentUsages < license.maxUsages;

      if (isValid) {
        // Increment usage count
        await updateDoc(doc(db, "licenses", licenseDoc.id), {
          currentUsages: license.currentUsages + 1,
        });
        await fetchLicenses(); // Refresh the list
      }

      return { isValid, license };
    } catch (error) {
      console.error("Error validating license:", error);
      return { isValid: false };
    }
  };

  const getActiveLicenses = (): License[] => {
    return licenses.filter((license) => {
      return license.isActive && license.currentUsages < license.maxUsages;
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
