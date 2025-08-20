import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Globe, 
  Settings, 
  Loader2, 
  Sparkles, 
  Check,
  Languages 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation, AVAILABLE_LANGUAGES, type Language } from '@/context/TranslationContext';
import LanguageSettingsModal from './LanguageSettingsModal';

const NavbarLanguageButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    currentLanguage, 
    isTranslating, 
    isTranslationEnabled, 
    setLanguage,
    toggleTranslation 
  } = useTranslation();

  const currentLanguageInfo = AVAILABLE_LANGUAGES.find(
    lang => lang.code === currentLanguage
  );

  const handleLanguageSelect = async (language: Language) => {
    await setLanguage(language);
  };

  const handleQuickToggle = () => {
    toggleTranslation();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="relative text-white/80 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
              disabled={isTranslating}
            >
              {isTranslating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  {isTranslationEnabled ? (
                    <div className="relative">
                      <Languages className="h-4 w-4" />
                      <Sparkles className="h-2 w-2 absolute -top-1 -right-1 text-yellow-400" />
                    </div>
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {currentLanguageInfo?.flag}
                  </span>
                </div>
              )}
              
              {/* Badge de statut AI */}
              {isTranslationEnabled && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 bg-green-500 text-white border-2 border-background"
                >
                  <Sparkles className="h-2 w-2" />
                </Badge>
              )}
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-black/90 backdrop-blur-xl border-white/20"
        >
          {/* Toggle AI Translation */}
          <DropdownMenuItem
            onClick={handleQuickToggle}
            className="flex items-center justify-between cursor-pointer hover:bg-white/10"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Traduction IA</span>
            </div>
            {isTranslationEnabled && (
              <Check className="h-4 w-4 text-green-400" />
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-white/20" />
          
          {/* Language Selection */}
          <div className="px-2 py-1">
            <div className="text-xs text-gray-400 mb-2 font-medium">Langues</div>
            <div className="grid grid-cols-2 gap-1">
              {AVAILABLE_LANGUAGES.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`cursor-pointer hover:bg-white/10 rounded p-2 ${
                    currentLanguage === language.code 
                      ? 'bg-white/20 text-white' 
                      : 'text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-sm">{language.flag}</span>
                    <span className="text-xs truncate">{language.name}</span>
                    {currentLanguage === language.code && (
                      <Check className="h-3 w-3 text-green-400 ml-auto" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
          
          <DropdownMenuSeparator className="bg-white/20" />
          
          {/* Settings */}
          <DropdownMenuItem
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">Paramètres avancés</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de paramètres détaillés */}
      <LanguageSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default NavbarLanguageButton;
