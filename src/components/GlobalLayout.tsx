import React from "react";
import { useUser } from "@/context/UserContext";
import LanguageSelector from "./LanguageSelector";
import HelpGuide from "./HelpGuide";

interface GlobalLayoutProps {
  children: React.ReactNode;
  showFloatingLanguageSelector?: boolean;
  showHelpGuide?: boolean;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({
  children,
  showFloatingLanguageSelector = true,
  showHelpGuide = true
}) => {
  const { currentUser } = useUser();

  return (
    <div className="relative">
      {children}

      {/* Sélecteur de langue flottant */}
      {showFloatingLanguageSelector && (
        <LanguageSelector variant="floating" />
      )}

      {/* Guide d'aide flottant */}
      {showHelpGuide && (
        <HelpGuide
          variant="floating"
          userRole={currentUser?.role || "user"}
        />
      )}
    </div>
  );
};

export default GlobalLayout;
