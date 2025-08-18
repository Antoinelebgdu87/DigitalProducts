import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MaintenanceSettings } from "@/types";

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  setMaintenanceMode: (isActive: boolean, message?: string) => Promise<void>;
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

  // Initialize maintenance settings on first load
  useEffect(() => {
    const initializeMaintenanceSettings = async () => {
      try {
        const maintenanceDoc = await getDoc(doc(db, "settings", MAINTENANCE_DOC_ID));
        
        if (!maintenanceDoc.exists()) {
          // Create default settings if they don't exist
          const defaultSettings = {
            isActive: false,
            message: DEFAULT_MESSAGE,
          };
          
          await setDoc(doc(db, "settings", MAINTENANCE_DOC_ID), defaultSettings);
          console.log("🛠️ Paramètres de maintenance Firebase initialisés");
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation des paramètres de maintenance:", error);
      }
    };

    initializeMaintenanceSettings();
  }, []);

  // Real-time listener for maintenance settings
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "settings", MAINTENANCE_DOC_ID),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setIsMaintenanceMode(data.isActive || false);
          setMaintenanceMessage(data.message || DEFAULT_MESSAGE);
          console.log("🛠️ Paramètres de maintenance Firebase mis à jour:", data);
        }
      },
      (error) => {
        console.error("Erreur lors de l'écoute des paramètres de maintenance:", error);
        // Fallback to localStorage in case of error
        const stored = localStorage.getItem("maintenanceMode");
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setIsMaintenanceMode(data.isActive || false);
            setMaintenanceMessage(data.message || DEFAULT_MESSAGE);
          } catch {
            // Ignore parse errors
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Migrate existing localStorage data on first load
  useEffect(() => {
    const migrateLocalStorage = async () => {
      try {
        const stored = localStorage.getItem("maintenanceMode");
        if (stored) {
          const localData = JSON.parse(stored);
          console.log("🔄 Migration des paramètres de maintenance vers Firebase...");
          
          // Check if Firebase already has data
          const maintenanceDoc = await getDoc(doc(db, "settings", MAINTENANCE_DOC_ID));
          if (!maintenanceDoc.exists()) {
            // Migrate to Firebase
            await setDoc(doc(db, "settings", MAINTENANCE_DOC_ID), {
              isActive: localData.isActive || false,
              message: localData.message || DEFAULT_MESSAGE,
            });
            console.log("✅ Migration des paramètres de maintenance terminée");
            // Remove from localStorage after successful migration
            localStorage.removeItem("maintenanceMode");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la migration des paramètres de maintenance:", error);
      }
    };

    migrateLocalStorage();
  }, []);

  const setMaintenanceMode = async (
    isActive: boolean,
    message: string = DEFAULT_MESSAGE,
  ) => {
    try {
      const data = { isActive, message };
      await setDoc(doc(db, "settings", MAINTENANCE_DOC_ID), data);
      console.log("🛠️ Mode maintenance Firebase mis à jour:", data);
      
      // Also update localStorage as backup
      localStorage.setItem("maintenanceMode", JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mode maintenance:", error);
      // Fallback to localStorage
      const data = { isActive, message };
      localStorage.setItem("maintenanceMode", JSON.stringify(data));
      setIsMaintenanceMode(isActive);
      setMaintenanceMessage(message);
      throw error;
    }
  };

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceMode,
        maintenanceMessage,
        setMaintenanceMode,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error("useMaintenance must be used within a MaintenanceProvider");
  }
  return context;
};
