import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ThemePreset = "default" | "blue" | "purple" | "green" | "red" | "orange" | "pink" | "teal";

interface ThemeContextType {
  mode: ThemeMode;
  preset: ThemePreset;
  setMode: (mode: ThemeMode) => void;
  setPreset: (preset: ThemePreset) => void;
  isDark: boolean;
  presets: { id: ThemePreset; name: string; colors: Record<string, string> }[];
}

const themePresets = {
  default: {
    name: "Défaut",
    colors: {
      "--background": "0 0% 5%",
      "--foreground": "0 0% 95%",
      "--primary": "0 0% 98%",
      "--primary-foreground": "0 0% 9%",
      "--secondary": "0 0% 15%",
      "--secondary-foreground": "0 0% 98%",
      "--accent": "0 0% 15%",
      "--accent-foreground": "0 0% 98%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--muted": "0 0% 15%",
      "--muted-foreground": "0 0% 64%",
      "--card": "0 0% 5%",
      "--card-foreground": "0 0% 95%",
      "--popover": "0 0% 5%",
      "--popover-foreground": "0 0% 95%",
      "--border": "0 0% 15%",
      "--input": "0 0% 15%",
      "--ring": "0 0% 98%",
    }
  },
  blue: {
    name: "Bleu",
    colors: {
      "--background": "222 84% 5%",
      "--foreground": "210 40% 98%",
      "--primary": "217 91% 60%",
      "--primary-foreground": "222 84% 5%",
      "--secondary": "217 33% 17%",
      "--secondary-foreground": "210 40% 98%",
      "--accent": "217 33% 17%",
      "--accent-foreground": "210 40% 98%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "210 40% 98%",
      "--muted": "217 33% 17%",
      "--muted-foreground": "215 20% 65%",
      "--card": "222 84% 5%",
      "--card-foreground": "210 40% 98%",
      "--popover": "222 84% 5%",
      "--popover-foreground": "210 40% 98%",
      "--border": "217 33% 17%",
      "--input": "217 33% 17%",
      "--ring": "217 91% 60%",
    }
  },
  purple: {
    name: "Violet",
    colors: {
      "--background": "276 100% 3%",
      "--foreground": "270 5% 95%",
      "--primary": "263 70% 50%",
      "--primary-foreground": "276 100% 3%",
      "--secondary": "276 34% 12%",
      "--secondary-foreground": "270 5% 95%",
      "--accent": "276 34% 12%",
      "--accent-foreground": "270 5% 95%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "270 5% 95%",
      "--muted": "276 34% 12%",
      "--muted-foreground": "270 5% 60%",
      "--card": "276 100% 3%",
      "--card-foreground": "270 5% 95%",
      "--popover": "276 100% 3%",
      "--popover-foreground": "270 5% 95%",
      "--border": "276 34% 12%",
      "--input": "276 34% 12%",
      "--ring": "263 70% 50%",
    }
  },
  green: {
    name: "Vert",
    colors: {
      "--background": "120 100% 2%",
      "--foreground": "120 5% 95%",
      "--primary": "142 76% 36%",
      "--primary-foreground": "120 100% 2%",
      "--secondary": "142 30% 10%",
      "--secondary-foreground": "120 5% 95%",
      "--accent": "142 30% 10%",
      "--accent-foreground": "120 5% 95%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "120 5% 95%",
      "--muted": "142 30% 10%",
      "--muted-foreground": "120 5% 60%",
      "--card": "120 100% 2%",
      "--card-foreground": "120 5% 95%",
      "--popover": "120 100% 2%",
      "--popover-foreground": "120 5% 95%",
      "--border": "142 30% 10%",
      "--input": "142 30% 10%",
      "--ring": "142 76% 36%",
    }
  },
  red: {
    name: "Rouge",
    colors: {
      "--background": "0 100% 3%",
      "--foreground": "0 5% 95%",
      "--primary": "0 84% 60%",
      "--primary-foreground": "0 100% 3%",
      "--secondary": "0 30% 12%",
      "--secondary-foreground": "0 5% 95%",
      "--accent": "0 30% 12%",
      "--accent-foreground": "0 5% 95%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 5% 95%",
      "--muted": "0 30% 12%",
      "--muted-foreground": "0 5% 60%",
      "--card": "0 100% 3%",
      "--card-foreground": "0 5% 95%",
      "--popover": "0 100% 3%",
      "--popover-foreground": "0 5% 95%",
      "--border": "0 30% 12%",
      "--input": "0 30% 12%",
      "--ring": "0 84% 60%",
    }
  },
  orange: {
    name: "Orange",
    colors: {
      "--background": "24 100% 3%",
      "--foreground": "24 5% 95%",
      "--primary": "20 91% 48%",
      "--primary-foreground": "24 100% 3%",
      "--secondary": "24 30% 12%",
      "--secondary-foreground": "24 5% 95%",
      "--accent": "24 30% 12%",
      "--accent-foreground": "24 5% 95%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "24 5% 95%",
      "--muted": "24 30% 12%",
      "--muted-foreground": "24 5% 60%",
      "--card": "24 100% 3%",
      "--card-foreground": "24 5% 95%",
      "--popover": "24 100% 3%",
      "--popover-foreground": "24 5% 95%",
      "--border": "24 30% 12%",
      "--input": "24 30% 12%",
      "--ring": "20 91% 48%",
    }
  },
  pink: {
    name: "Rose",
    colors: {
      "--background": "325 100% 3%",
      "--foreground": "325 5% 95%",
      "--primary": "330 81% 60%",
      "--primary-foreground": "325 100% 3%",
      "--secondary": "325 30% 12%",
      "--secondary-foreground": "325 5% 95%",
      "--accent": "325 30% 12%",
      "--accent-foreground": "325 5% 95%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "325 5% 95%",
      "--muted": "325 30% 12%",
      "--muted-foreground": "325 5% 60%",
      "--card": "325 100% 3%",
      "--card-foreground": "325 5% 95%",
      "--popover": "325 100% 3%",
      "--popover-foreground": "325 5% 95%",
      "--border": "325 30% 12%",
      "--input": "325 30% 12%",
      "--ring": "330 81% 60%",
    }
  },
  teal: {
    name: "Sarcelle",
    colors: {
      "--background": "180 100% 2%",
      "--foreground": "180 5% 95%",
      "--primary": "180 83% 47%",
      "--primary-foreground": "180 100% 2%",
      "--secondary": "180 30% 10%",
      "--secondary-foreground": "180 5% 95%",
      "--accent": "180 30% 10%",
      "--accent-foreground": "180 5% 95%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "180 5% 95%",
      "--muted": "180 30% 10%",
      "--muted-foreground": "180 5% 60%",
      "--card": "180 100% 2%",
      "--card-foreground": "180 5% 95%",
      "--popover": "180 100% 2%",
      "--popover-foreground": "180 5% 95%",
      "--border": "180 30% 10%",
      "--input": "180 30% 10%",
      "--ring": "180 83% 47%",
    }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [preset, setPresetState] = useState<ThemePreset>("default");
  const [isDark, setIsDark] = useState(true);

  const presets = Object.entries(themePresets).map(([id, config]) => ({
    id: id as ThemePreset,
    name: config.name,
    colors: config.colors,
  }));

  // Load saved preferences
  useEffect(() => {
    const savedMode = localStorage.getItem("theme_mode") as ThemeMode;
    const savedPreset = localStorage.getItem("theme_preset") as ThemePreset;

    if (savedMode) setModeState(savedMode);
    if (savedPreset && themePresets[savedPreset]) setPresetState(savedPreset);
  }, []);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    const currentPreset = themePresets[preset];

    // Apply custom properties
    Object.entries(currentPreset.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Handle dark/light mode
    const shouldBeDark = mode === "dark" || 
      (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      // Apply light mode variants (you can add light variants to presets if needed)
    }
  }, [mode, preset]);

  // Listen for system theme changes
  useEffect(() => {
    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        setIsDark(mediaQuery.matches);
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("theme_mode", newMode);
  };

  const setPreset = (newPreset: ThemePreset) => {
    setPresetState(newPreset);
    localStorage.setItem("theme_preset", newPreset);
  };

  const value = {
    mode,
    preset,
    setMode,
    setPreset,
    isDark,
    presets,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
