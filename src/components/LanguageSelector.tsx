import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  ChevronDown, 
  Check, 
  Sparkles,
  Zap
} from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

interface LanguageSelectorProps {
  variant?: "default" | "compact" | "floating";
  showLabel?: boolean;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = "default", 
  showLabel = true,
  className = ""
}) => {
  const { currentLanguage, setLanguage, AVAILABLE_LANGUAGES, isTranslationEnabled, toggleTranslation } = useTranslation();
  
  const flagMap = {
    fr: "🇫🇷",
    en: "🇺🇸", 
    pt: "🇵🇹",
    es: "🇪🇸",
    de: "🇩🇪",
    it: "🇮🇹"
  };

  const languageNames = {
    fr: "Français",
    en: "English",
    pt: "Português",
    es: "Español", 
    de: "Deutsch",
    it: "Italiano"
  };

  const getCurrentLanguageInfo = () => {
    return {
      flag: flagMap[currentLanguage] || "🇫🇷",
      name: languageNames[currentLanguage] || "Français"
    };
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode as any);
  };

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 ${className}`}
          >
            <Globe className="w-4 h-4 mr-1" />
            <span>{getCurrentLanguageInfo().flag}</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-md border-gray-700 min-w-[200px]">
          <DropdownMenuLabel className="text-white font-medium flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Choisir la langue
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          
          {(AVAILABLE_LANGUAGES || [
            { code: "fr", name: "Français", flag: "🇫🇷" },
            { code: "en", name: "English", flag: "🇺🇸" },
            { code: "pt", name: "Português", flag: "🇵🇹" }
          ]).map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="text-white hover:bg-gray-700/50 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {currentLanguage === lang.code && (
                <Check className="w-4 h-4 text-green-400" />
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem
            onClick={toggleTranslation}
            className="text-white hover:bg-gray-700/50 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-blue-400" />
                <span>Traduction IA</span>
              </div>
              <Badge variant={isTranslationEnabled ? "default" : "outline"} className="ml-2">
                {isTranslationEnabled ? "ON" : "OFF"}
              </Badge>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full p-3"
            >
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-gray-900/95 backdrop-blur-md border-gray-700 min-w-[250px] mb-2"
            side="top"
            align="end"
          >
            <DropdownMenuLabel className="text-white font-medium flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
              Langue & Traduction
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            
            <div className="p-2">
              <div className="text-xs text-gray-400 mb-2">Langue actuelle:</div>
              <div className="flex items-center p-2 bg-gray-800/50 rounded-lg mb-3">
                <span className="text-lg mr-2">{getCurrentLanguageInfo().flag}</span>
                <span className="text-white font-medium">{getCurrentLanguageInfo().name}</span>
              </div>
            </div>
            
            <DropdownMenuLabel className="text-gray-300 text-xs">Changer de langue:</DropdownMenuLabel>
            {(AVAILABLE_LANGUAGES || [
              { code: "fr", name: "Français", flag: "🇫🇷" },
              { code: "en", name: "English", flag: "🇺🇸" },
              { code: "pt", name: "Português", flag: "🇵🇹" }
            ]).map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="text-white hover:bg-gray-700/50 cursor-pointer flex items-center justify-between"
                disabled={currentLanguage === lang.code}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {currentLanguage === lang.code && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              onClick={toggleTranslation}
              className="text-white hover:bg-gray-700/50 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Traduction IA</span>
                </div>
                <Badge 
                  variant={isTranslationEnabled ? "default" : "outline"} 
                  className={`ml-2 ${isTranslationEnabled ? "bg-green-600 text-white" : ""}`}
                >
                  {isTranslationEnabled ? "ON" : "OFF"}
                </Badge>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Default variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 ${className}`}
        >
          <Globe className="w-4 h-4 mr-2" />
          {showLabel && <span className="mr-2">{getCurrentLanguageInfo().name}</span>}
          <span className="mr-1">{getCurrentLanguageInfo().flag}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-md border-gray-700 min-w-[250px]">
        <DropdownMenuLabel className="text-white font-medium flex items-center">
          <Globe className="w-4 h-4 mr-2" />
          Langue & Traduction
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <div className="p-2">
          <div className="text-xs text-gray-400 mb-2">Sélectionnez votre langue:</div>
        </div>
        
        {(AVAILABLE_LANGUAGES || [
          { code: "fr", name: "Français", flag: "🇫🇷" },
          { code: "en", name: "English", flag: "🇺🇸" },
          { code: "pt", name: "Português", flag: "🇵🇹" },
          { code: "es", name: "Español", flag: "🇪🇸" },
          { code: "de", name: "Deutsch", flag: "🇩🇪" },
          { code: "it", name: "Italiano", flag: "🇮🇹" }
        ]).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="text-white hover:bg-gray-700/50 cursor-pointer flex items-center justify-between mx-1 rounded-md"
          >
            <div className="flex items-center">
              <span className="mr-3 text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {currentLanguage === lang.code && (
              <Check className="w-4 h-4 text-green-400" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          onClick={toggleTranslation}
          className="text-white hover:bg-gray-700/50 cursor-pointer mx-1 rounded-md"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-400" />
              <span>Traduction automatique</span>
            </div>
            <Badge 
              variant={isTranslationEnabled ? "default" : "outline"} 
              className={`ml-2 ${isTranslationEnabled ? "bg-green-600 text-white" : ""}`}
            >
              {isTranslationEnabled ? "ON" : "OFF"}
            </Badge>
          </div>
        </DropdownMenuItem>
        
        {isTranslationEnabled && (
          <div className="p-2 mx-1">
            <div className="text-xs text-green-400 bg-green-400/10 p-2 rounded border border-green-400/20">
              ✓ Traduction automatique activée
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
