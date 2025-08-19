import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminMode, TimerSettings } from "@/types";

interface AdminModeContextType {
  adminMode: AdminMode;
  timerSettings: TimerSettings;
  setShopMode: (isShopMode: boolean) => void;
  setSelectedUser: (userId?: string) => void;
  updateTimerSettings: (settings: Partial<TimerSettings>) => void;
  canCreateProduct: (lastCreation?: Date) => boolean;
  getRemainingCooldown: (lastCreation?: Date) => number; // en minutes
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined);

const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  shopProductCooldown: 30, // 30 minutes par défaut
  commentCooldown: 5, // 5 minutes par défaut
};

export const AdminModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminMode, setAdminMode] = useState<AdminMode>({
    isShopMode: false,
    selectedUserId: undefined,
  });

  const [timerSettings, setTimerSettings] = useState<TimerSettings>(DEFAULT_TIMER_SETTINGS);

  // Charger les paramètres depuis localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("admin_timer_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setTimerSettings({ ...DEFAULT_TIMER_SETTINGS, ...parsed });
      } catch (error) {
        console.warn("Erreur lors du chargement des paramètres de timer");
      }
    }
  }, []);

  // Sauvegarder les paramètres dans localStorage
  useEffect(() => {
    localStorage.setItem("admin_timer_settings", JSON.stringify(timerSettings));
  }, [timerSettings]);

  const setShopMode = (isShopMode: boolean) => {
    setAdminMode(prev => ({ ...prev, isShopMode }));
  };

  const setSelectedUser = (userId?: string) => {
    setAdminMode(prev => ({ ...prev, selectedUserId: userId }));
  };

  const updateTimerSettings = (settings: Partial<TimerSettings>) => {
    setTimerSettings(prev => ({ ...prev, ...settings }));
  };

  const canCreateProduct = (lastCreation?: Date): boolean => {
    if (!lastCreation) return true;
    
    const now = new Date();
    const timeSinceLastCreation = (now.getTime() - lastCreation.getTime()) / (1000 * 60); // en minutes
    
    return timeSinceLastCreation >= timerSettings.shopProductCooldown;
  };

  const getRemainingCooldown = (lastCreation?: Date): number => {
    if (!lastCreation) return 0;
    
    const now = new Date();
    const timeSinceLastCreation = (now.getTime() - lastCreation.getTime()) / (1000 * 60); // en minutes
    const remaining = Math.max(0, timerSettings.shopProductCooldown - timeSinceLastCreation);
    
    return Math.ceil(remaining);
  };

  return (
    <AdminModeContext.Provider
      value={{
        adminMode,
        timerSettings,
        setShopMode,
        setSelectedUser,
        updateTimerSettings,
        canCreateProduct,
        getRemainingCooldown,
      }}
    >
      {children}
    </AdminModeContext.Provider>
  );
};

export const useAdminMode = () => {
  const context = useContext(AdminModeContext);
  if (context === undefined) {
    throw new Error("useAdminMode must be used within an AdminModeProvider");
  }
  return context;
};
