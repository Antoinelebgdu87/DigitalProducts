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
import { db, shouldUseFirebase } from "@/lib/firebase";
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
  const licenseToFirestore = (license: Omit<License, "id">) => {
    return {
      ...license,
      createdAt: Timestamp.fromDate(license.createdAt),
    };
  };

  // Real-time listener for licenses with fallback
  useEffect(() => {
    const loadLicenses = () => {
      if (!shouldUseFirebase()) {
        // Use localStorage fallback
        try {
          const stored = localStorage.getItem("licenses");
          if (stored) {
            const localLicenses = JSON.parse(stored);
            setLicenses(
              localLicenses.map((license: any) => ({
                ...license,
                createdAt: new Date(license.createdAt),
              }))
            );
            console.log("🔑 Licences chargées depuis localStorage:", localLicenses.length);
          } else {
            setLicenses([]);
          }
        } catch (error) {
          console.error("Error loading licenses from localStorage:", error);
          setLicenses([]);
        }
        setLoading(false);
        return;
      }

      // Use Firebase if available
      const unsubscribe = onSnapshot(
        query(collection(db, "licenses"), orderBy("createdAt", "desc")),
        (snapshot) => {
          try {
            const licensesData = snapshot.docs.map((doc) =>
              parseLicense({ id: doc.id, ...doc.data() }),
            );
            setLicenses(licensesData);
            console.log("🔑 Licences Firebase chargées:", licensesData.length);
            // Save to localStorage as backup
            localStorage.setItem("licenses", JSON.stringify(licensesData));
          } catch (error) {
            console.error("Error parsing licenses:", error);
            setLicenses([]);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching licenses:", error);
          // Fallback to localStorage
          try {
            const stored = localStorage.getItem("licenses");
            if (stored) {
              const localLicenses = JSON.parse(stored);
              setLicenses(
                localLicenses.map((license: any) => ({
                  ...license,
                  createdAt: new Date(license.createdAt),
                }))
              );
              console.log("🔑 Fallback: licences chargées depuis localStorage");
            }
          } catch (localError) {
            console.log("⚠️ Aucune licence locale trouvée");
          }
          setLicenses([]);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    };

    loadLicenses();
  }, []);

  // Migrate existing localStorage data on first load (only if Firebase is available)
  useEffect(() => {
    if (!shouldUseFirebase()) return;

    const migrateLocalStorage = async () => {
      try {
        const stored = localStorage.getItem("licenses");
        if (stored) {
          const localLicenses = JSON.parse(stored) as License[];
          console.log(
            "🔄 Migration de",
            localLicenses.length,
            "licences vers Firebase...",
          );

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
              await addDoc(
                collection(db, "licenses"),
                licenseToFirestore(licenseData),
              );
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
      const newLicense: License = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        productId,
        code,
        category,
        maxUsages,
        currentUsages: 0,
        createdAt: new Date(),
        isActive: true,
      };

      if (shouldUseFirebase()) {
        await addDoc(collection(db, "licenses"), licenseToFirestore(newLicense));
        console.log("🎉 Nouvelle licence Firebase créée:", code);
      } else {
        // localStorage fallback
        const currentLicenses = [...licenses, newLicense];
        setLicenses(currentLicenses);
        localStorage.setItem("licenses", JSON.stringify(currentLicenses));
        console.log("🎉 Nouvelle licence créée en mode offline:", code);
      }
      
      return code;
    } catch (error) {
      console.error("Error creating license:", error);
      throw error;
    }
  };

  const deleteLicense = async (licenseId: string): Promise<void> => {
    try {
      if (shouldUseFirebase()) {
        await deleteDoc(doc(db, "licenses", licenseId));
        console.log("🗑️ Licence Firebase supprimée:", licenseId);
      } else {
        // localStorage fallback
        const updatedLicenses = licenses.filter(l => l.id !== licenseId);
        setLicenses(updatedLicenses);
        localStorage.setItem("licenses", JSON.stringify(updatedLicenses));
        console.log("🗑️ Licence supprimée en mode offline:", licenseId);
      }
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
      if (shouldUseFirebase()) {
        const q = query(
          collection(db, "licenses"),
          where("code", "==", licenseCode),
          where("productId", "==", productId),
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          return { isValid: false };
        }

        const licenseDoc = snapshot.docs[0];
        const license = parseLicense({ id: licenseDoc.id, ...licenseDoc.data() });

        const isValid =
          license.isActive && license.currentUsages < license.maxUsages;

        if (isValid) {
          // Increment usage count
          await updateDoc(doc(db, "licenses", license.id), {
            currentUsages: license.currentUsages + 1,
          });
          console.log("✅ Licence Firebase validée:", licenseCode);
        }

        return { isValid, license };
      } else {
        // localStorage fallback
        const license = licenses.find(l => 
          l.code === licenseCode && l.productId === productId
        );

        if (!license) {
          return { isValid: false };
        }

        const isValid = license.isActive && license.currentUsages < license.maxUsages;

        if (isValid) {
          // Increment usage count in localStorage
          const updatedLicenses = licenses.map(l => 
            l.id === license.id 
              ? { ...l, currentUsages: l.currentUsages + 1 }
              : l
          );
          setLicenses(updatedLicenses);
          localStorage.setItem("licenses", JSON.stringify(updatedLicenses));
          console.log("✅ Licence validée en mode offline:", licenseCode);
        }

        return { isValid, license };
      }
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
    console.log("📋 Licences gérées en temps réel via", shouldUseFirebase() ? "Firebase" : "localStorage");
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
