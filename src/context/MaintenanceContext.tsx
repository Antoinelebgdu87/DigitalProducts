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

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(DEFAULT_MESSAGE);

  useEffect(() => {
    // Load maintenance settings from Firebase
    const loadMaintenanceSettings = async () => {
      try {
        const maintenanceDocRef = doc(db, "settings", "maintenance");
        
        // Listen to real-time changes
        const unsubscribe = onSnapshot(maintenanceDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setIsMaintenanceMode(data.isActive || false);
            setMaintenanceMessage(data.message || DEFAULT_MESSAGE);
            console.log("🛠️ Paramètres de maintenance chargés depuis Firebase");
          } else {
            // Create default settings if document doesn't exist
            setDoc(maintenanceDocRef, {
              isActive: false,
              message: DEFAULT_MESSAGE
            }).catch(console.error);
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres de maintenance:", error);
      }
    };

    const unsubscribe = loadMaintenanceSettings();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const setMaintenanceMode = async (
    isActive: boolean,
    message: string = DEFAULT_MESSAGE,
  ) => {
    try {
      const maintenanceDocRef = doc(db, "settings", "maintenance");
      await setDoc(maintenanceDocRef, {
        isActive,
        message,
        updatedAt: new Date()
      });

      setIsMaintenanceMode(isActive);
      setMaintenanceMessage(message);
      console.log("🛠️ Mode maintenance mis à jour dans Firebase:", isActive);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mode maintenance:", error);
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
