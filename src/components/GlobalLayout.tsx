import React from "react";
import LanguageSelector from "./LanguageSelector";

interface GlobalLayoutProps {
  children: React.ReactNode;
  showFloatingLanguageSelector?: boolean;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ 
  children, 
  showFloatingLanguageSelector = true 
}) => {
  return (
    <div className="relative">
      {children}
      
      {/* Sélecteur de langue flottant */}
      {showFloatingLanguageSelector && (
        <LanguageSelector variant="floating" />
      )}
    </div>
  );
};

export default GlobalLayout;
