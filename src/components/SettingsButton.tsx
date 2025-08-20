import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import SettingsModal from "@/components/SettingsModal";
import { useLanguage } from "@/context/LanguageContext";

interface SettingsButtonProps {
  className?: string;
  variant?: "floating" | "inline";
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ 
  className, 
  variant = "floating" 
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useLanguage();

  if (variant === "floating") {
    return (
      <>
        <Button
          onClick={() => setIsSettingsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "transition-all duration-200 hover:scale-110",
            "border-2 border-background/10",
            "group animate-pulse-glow",
            className
          )}
          size="icon"
        >
          <div className="relative">
            <Settings className="w-6 h-6 transition-transform group-hover:rotate-180 duration-300" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-400 animate-glow" />
          </div>
        </Button>

        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsSettingsOpen(true)}
        variant="outline"
        size="sm"
        className={cn("flex items-center space-x-2", className)}
      >
        <Settings className="w-4 h-4" />
        <span>{t("nav.settings")}</span>
      </Button>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default SettingsButton;
