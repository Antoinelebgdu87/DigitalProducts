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
  updateDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { License } from "@/types";

export const useLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to convert Firestore data to License objects
  const parseLicense = (licenseData: any): License => {
    return {
      ...licenseData,
      createdAt: licenseData.createdAt?.toDate() || new Date(),
    };
  };

  // Helper function to convert License object to Firestore data
  const licenseToFirestore = (license: Omit<License, 'id'>) => {
    return {
      ...license,
      createdAt: Timestamp.fromDate(license.createdAt),
    };
  };

  // Real-time listener for licenses
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "licenses"), orderBy("createdAt", "desc")),
      (snapshot) => {
        try {
          const licensesData = snapshot.docs.map(doc => 
            parseLicense({ id: doc.id, ...doc.data() })
          );
          setLicenses(licensesData);
          console.log("🔑 Licences Firebase chargées:", licensesData.length);
        } catch (error) {
          console.error("Error parsing licenses:", error);
          setLicenses([]);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching licenses:", error);
        setLicenses([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Migrate existing localStorage data on first load
  useEffect(() => {
    const migrateLocalStorage = async () => {
      try {
        const stored = localStorage.getItem("licenses");
        if (stored) {
          const localLicenses = JSON.parse(stored) as License[];
          console.log("🔄 Migration de", localLicenses.length, "licences vers Firebase...");
          
          // Check if Firebase already has data
          const snapshot = await getDocs(collection(db, "licenses"));
          if (snapshot.empty) {
            // Migrate each license
            for (const license of localLicenses) {
              const { id, ...licenseWithoutId } = license;
              const licenseData = {
                ...licenseWithoutId,
                createdAt: new Date(license.createdAt),
              };
              await addDoc(collection(db, "licenses"), licenseToFirestore(licenseData));
            }
            console.log("✅ Migration des licences terminée");
            // Remove from localStorage after successful migration
            localStorage.removeItem("licenses");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la migration des licences:", error);
      }
    };

    migrateLocalStorage();
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
      const newLicense = {
        productId,
        code,
        category,
        maxUsages,
        currentUsages: 0,
        createdAt: new Date(),
        isActive: true,
      };

      await addDoc(collection(db, "licenses"), licenseToFirestore(newLicense));
      console.log("🎉 Nouvelle licence Firebase créée:", code);
      return code;
    } catch (error) {
      console.error("Error creating license:", error);
      throw error;
    }
  };

  const deleteLicense = async (licenseId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "licenses", licenseId));
      console.log("🗑️ Licence Firebase supprimée:", licenseId);
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
        where("productId", "==", productId)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return { isValid: false };
      }

      const licenseDoc = snapshot.docs[0];
      const license = parseLicense({ id: licenseDoc.id, ...licenseDoc.data() });

      const isValid = license.isActive && license.currentUsages < license.maxUsages;

      if (isValid) {
        // Increment usage count
        await updateDoc(doc(db, "licenses", license.id), {
          currentUsages: license.currentUsages + 1,
        });
        console.log("✅ Licence Firebase validée:", licenseCode);
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

  const fetchLicenses = async () => {
    // This function is kept for compatibility but real-time updates handle the data
    console.log("📋 Licences gérées en temps réel via Firebase");
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
