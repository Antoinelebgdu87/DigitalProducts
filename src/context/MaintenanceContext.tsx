import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db, shouldUseFirebase } from "@/lib/firebase";
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

    const initializeMaintenanceSettings = async () => {
      try {
        // First load from localStorage for immediate availability
        const stored = localStorage.getItem("maintenanceMode");
        if (stored && isMounted) {
          try {
            const data = JSON.parse(stored);
            setIsMaintenanceMode(data.isActive || false);
            setMaintenanceMessage(data.message || DEFAULT_MESSAGE);
            console.log(
              "🛠️ Paramètres de maintenance chargés depuis localStorage",
            );
          } catch (error) {
            console.warn("Erreur lors du parsing localStorage:", error);
          }
        }

        // Then try Firebase
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
          console.log("🛠️ Paramètres de maintenance Firebase chargés");
        }

        setIsFirebaseReady(true);
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation des paramètres de maintenance:",
          error,
        );
        // Keep localStorage values or defaults
        // If permissions error, use default values
        if (
          error instanceof Error &&
          (error.message.includes("permissions") ||
            error.message.includes("Missing or insufficient"))
        ) {
          console.log(
            "⚠️ Permissions Firebase manquantes - utilisation des valeurs par défaut",
          );
          setIsMaintenanceMode(false);
          setMaintenanceMessage(DEFAULT_MESSAGE);
          setIsFirebaseReady(false); // Désactiver les listeners Firebase
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeMaintenanceSettings();

    return () => {
      isMounted = false;
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

      // Then update Firebase
      await setDoc(doc(db, "settings", MAINTENANCE_DOC_ID), data);
      console.log("🛠️ Mode maintenance Firebase mis à jour:", data);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du mode maintenance:",
        error,
      );
      // Local values are already updated, so UI stays responsive
      throw error;
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
