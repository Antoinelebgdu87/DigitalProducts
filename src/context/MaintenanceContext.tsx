import React, { createContext, useContext, useState, useEffect } from "react";
// Temporarily comment out Firebase imports to debug
// import { doc, onSnapshot, setDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
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
    // Simplified for debug - load from localStorage
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

    // Return empty cleanup function to prevent unsubscribe errors
    return () => {
      // No cleanup needed for localStorage
    };
  }, []);

  const setMaintenanceMode = async (
    isActive: boolean,
    message: string = DEFAULT_MESSAGE,
  ) => {
    // Save to localStorage instead of Firebase
    const data = { isActive, message };
    localStorage.setItem("maintenanceMode", JSON.stringify(data));
    setIsMaintenanceMode(isActive);
    setMaintenanceMessage(message);
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
