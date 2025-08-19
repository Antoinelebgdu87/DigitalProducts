import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FirebaseService } from "@/lib/firebase-service";
import { MaintenanceSettings } from "@/types";

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  setMaintenanceMode: (isActive: boolean, message?: string) => Promise<void>;
  isLoading: boolean;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(
  undefined,
);

const DEFAULT_MESSAGE = "Update in progress, come back later 🛠️";
const MAINTENANCE_DOC_ID = "maintenance_settings";

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(DEFAULT_MESSAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // Initialize maintenance settings on first load
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    // Timeout de sécurité pour éviter le chargement infini
    const safetyTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn("⚠️ Timeout de chargement atteint - fallback vers les valeurs par défaut");
        setIsMaintenanceMode(false);
        setMaintenanceMessage(DEFAULT_MESSAGE);
        setIsFirebaseReady(false);
        setIsLoading(false);
      }
    }, 5000); // 5 secondes maximum

    const initializeMaintenanceSettings = async () => {
      try {
        console.log("🛠️ Initialisation des paramètres de maintenance...");

        // First load from localStorage for immediate availability
        const stored = localStorage.getItem("maintenanceMode");
        if (stored && isMounted) {
          try {
            const data = JSON.parse(stored);
            setIsMaintenanceMode(data.isActive || false);
            setMaintenanceMessage(data.message || DEFAULT_MESSAGE);
            console.log(
              "🛠️ Paramètres de maintenance chargés depuis localStorage:",
              data
            );
          } catch (error) {
            console.warn("Erreur lors du parsing localStorage:", error);
            // Utiliser les valeurs par défaut
            setIsMaintenanceMode(false);
            setMaintenanceMessage(DEFAULT_MESSAGE);
          }
        } else {
          // Aucune donnée locale, utiliser les valeurs par défaut
          setIsMaintenanceMode(false);
          setMaintenanceMessage(DEFAULT_MESSAGE);
          console.log("🛠️ Utilisation des valeurs par défaut");
        }

        // Terminer le chargement immédiatement si Firebase n'est pas disponible
        if (!shouldUseFirebase() || !db) {
          console.log("⚠️ Firebase non disponible - mode hors ligne");
          setIsFirebaseReady(false);
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        // Then try Firebase
        console.log("🔥 Tentative de connexion à Firebase...");
        const maintenanceDoc = await getDoc(
          doc(db, "settings", MAINTENANCE_DOC_ID),
        );

        if (!isMounted) return;

        if (!maintenanceDoc.exists()) {
          // Create default settings if they don't exist
          const defaultSettings = {
            isActive: false,
            message: DEFAULT_MESSAGE,
          };

          await setDoc(
            doc(db, "settings", MAINTENANCE_DOC_ID),
            defaultSettings,
          );
          console.log("🛠️ Paramètres de maintenance Firebase initialisés");
        } else {
          // Load from Firebase
          const data = maintenanceDoc.data();
          setIsMaintenanceMode(data.isActive || false);
          setMaintenanceMessage(data.message || DEFAULT_MESSAGE);
          console.log("🛠️ Paramètres de maintenance Firebase chargés:", data);
        }

        setIsFirebaseReady(true);
        console.log("✅ Firebase connecté avec succès");
      } catch (error) {
        console.error(
          "❌ Erreur lors de l'initialisation des paramètres de maintenance:",
          error,
        );

        // Keep localStorage values or defaults
        console.log("🔄 Fallback vers les valeurs locales/par défaut");

        // Si aucune valeur locale, utiliser les valeurs par défaut
        if (!localStorage.getItem("maintenanceMode")) {
          setIsMaintenanceMode(false);
          setMaintenanceMessage(DEFAULT_MESSAGE);
        }

        setIsFirebaseReady(false); // Désactiver les listeners Firebase
      } finally {
        if (isMounted) {
          console.log("🏁 Chargement terminé");
          setIsLoading(false);
        }
      }
    };

    initializeMaintenanceSettings();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Real-time listener for maintenance settings (only after Firebase is ready)
  useEffect(() => {
    if (!isFirebaseReady) return;

    let isMounted = true;

    const unsubscribe = onSnapshot(
      doc(db, "settings", MAINTENANCE_DOC_ID),
      (doc) => {
        if (!isMounted) return;

        if (doc.exists()) {
          const data = doc.data();
          setIsMaintenanceMode(data.isActive || false);
          setMaintenanceMessage(data.message || DEFAULT_MESSAGE);
          console.log(
            "🛠️ Paramètres de maintenance Firebase mis à jour:",
            data,
          );

          // Also save to localStorage as backup
          localStorage.setItem(
            "maintenanceMode",
            JSON.stringify({
              isActive: data.isActive || false,
              message: data.message || DEFAULT_MESSAGE,
            }),
          );
        }
      },
      (error) => {
        console.error(
          "Erreur lors de l'écoute des paramètres de maintenance:",
          error,
        );
        // Keep current values, don't fallback to localStorage as we already loaded it
      },
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isFirebaseReady]);

  const setMaintenanceMode = async (
    isActive: boolean,
    message: string = DEFAULT_MESSAGE,
  ): Promise<void> => {
    try {
      const data = { isActive, message };

      // Update locally first for immediate feedback
      setIsMaintenanceMode(isActive);
      setMaintenanceMessage(message);
      localStorage.setItem("maintenanceMode", JSON.stringify(data));
      console.log("🛠️ Mode maintenance mis à jour localement:", data);

      // Then update Firebase if available
      if (shouldUseFirebase() && db && isFirebaseReady) {
        await setDoc(doc(db, "settings", MAINTENANCE_DOC_ID), data);
        console.log("🛠️ Mode maintenance Firebase mis à jour:", data);
      } else {
        console.log("⚠️ Firebase non disponible - sauvegarde locale uniquement");
      }
    } catch (error) {
      console.error(
        "❌ Erreur lors de la mise à jour du mode maintenance:",
        error,
      );
      // Local values are already updated, so UI stays responsive
      // Ne pas relancer l'erreur pour éviter de bloquer l'UI
      console.log("🔄 Utilisation de la sauvegarde locale uniquement");
    }
  };

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceMode,
        maintenanceMessage,
        setMaintenanceMode,
        isLoading,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = (): MaintenanceContextType => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error("useMaintenance must be used within a MaintenanceProvider");
  }
  return context;
};
