import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { License } from "@/types";

export const useLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  // Load licenses from Firebase with real-time updates
  useEffect(() => {
    console.log("🚀 Initialisation du hook useLicenses...");
    
    let isMounted = true;
    
    const licensesQuery = query(
      collection(db, "licenses"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      licensesQuery,
      (snapshot) => {
        if (!isMounted) return;

        try {
          const licensesData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              code: data.code,
              productId: data.productId,
              category: data.category,
              isUsed: data.isUsed || false,
              usageCount: data.usageCount || 0,
              maxUsages: data.maxUsages || 1,
              usedBy: data.usedBy || null,
              usedAt: data.usedAt || null,
              createdAt: data.createdAt || Timestamp.now(),
            } as License;
          });

          setLicenses(licensesData);
          console.log("🔑 Licences chargées depuis Firebase:", licensesData.length);
        } catch (error) {
          console.error("❌ Erreur lors du traitement des licences:", error);
          setLicenses([]);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("❌ Erreur lors de l'écoute des licences:", error);
        setLicenses([]);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const createLicense = async (
    productId: string,
    category: "compte" | "carte-cadeau" | "cheat",
    maxUsages: number = 1
  ): Promise<string> => {
    try {
      console.log("🎫 Création d'une nouvelle licence pour le produit:", productId);

      // Generate license code
      const code = `${category.toUpperCase()}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      const licenseData = {
        code,
        productId,
        category,
        isUsed: false,
        usageCount: 0,
        maxUsages,
        usedBy: null,
        usedAt: null,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "licenses"), licenseData);
      console.log("✅ Licence créée avec ID:", docRef.id, "Code:", code);

      return code;
    } catch (error) {
      console.error("❌ Erreur lors de la création de la licence:", error);
      throw error;
    }
  };

  const deleteLicense = async (licenseId: string): Promise<void> => {
    try {
      console.log("🗑️ Suppression de la licence:", licenseId);

      await deleteDoc(doc(db, "licenses", licenseId));
      console.log("✅ Licence supprimée avec succès:", licenseId);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de la licence:", error);
      throw error;
    }
  };

  const validateLicense = async (
    licenseCode: string,
    userId: string
  ): Promise<{
    isValid: boolean;
    productId?: string;
    category?: string;
    message: string;
  }> => {
    try {
      console.log("🔍 Validation de la licence:", licenseCode);

      const license = licenses.find((l) => l.code === licenseCode);
      
      if (!license) {
        console.log("❌ Licence non trouvée:", licenseCode);
        return {
          isValid: false,
          message: "Code de licence invalide ou inexistant",
        };
      }

      if (license.usageCount >= license.maxUsages) {
        console.log("❌ Licence épuisée:", licenseCode);
        return {
          isValid: false,
          message: `Cette licence a atteint sa limite d'utilisation (${license.maxUsages})`,
        };
      }

      const isValid = license.usageCount < license.maxUsages;

      if (isValid) {
        // Increment usage count
        const updatedLicense = {
          usageCount: license.usageCount + 1,
          isUsed: license.usageCount + 1 >= license.maxUsages,
          usedBy: userId,
          usedAt: Timestamp.now(),
        };

        await updateDoc(doc(db, "licenses", license.id), updatedLicense);
        console.log("✅ Licence validée et mise à jour:", licenseCode);

        return {
          isValid: true,
          productId: license.productId,
          category: license.category,
          message: `Licence validée avec succès! Utilisations restantes: ${
            license.maxUsages - (license.usageCount + 1)
          }`,
        };
      }

      return {
        isValid: false,
        message: "Licence invalide",
      };
    } catch (error) {
      console.error("❌ Erreur lors de la validation de la licence:", error);
      return {
        isValid: false,
        message: "Erreur lors de la validation de la licence",
      };
    }
  };

  const getActiveLicenses = () => {
    return licenses.filter((license) => license.usageCount < license.maxUsages);
  };

  const getUsedLicenses = () => {
    return licenses.filter((license) => license.usageCount >= license.maxUsages);
  };

  console.log(
    "🔑 Licences gérées en temps réel via Firebase:",
    licenses.length,
    "licences"
  );

  return {
    licenses,
    loading,
    createLicense,
    deleteLicense,
    validateLicense,
    getActiveLicenses,
    getUsedLicenses,
  };
};
