import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Globe, Loader2, Sparkles } from 'lucide-react';
import { useTranslation, AVAILABLE_LANGUAGES } from '@/context/TranslationContext';
import LanguageSettingsModal from './LanguageSettingsModal';

const LanguageSettingsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentLanguage, isTranslating, isTranslationEnabled } = useTranslation();

  const currentLanguageInfo = AVAILABLE_LANGUAGES.find(
    lang => lang.code === currentLanguage
  );

  return (
    <>
      {/* Bouton flottant en bas à droite */}
      <div className="fixed bottom-6 right-6 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
              disabled={isTranslating}
            >
              {isTranslating ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="flex items-center justify-center">
                  {isTranslationEnabled ? (
                    <div className="relative">
                      <Globe className="h-6 w-6" />
                      <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400" />
                    </div>
                  ) : (
                    <Settings className="h-6 w-6" />
                  )}
                </div>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <div className="space-y-1">
              <div className="font-medium">Paramètres de traduction</div>
              <div className="text-xs opacity-80">
                Langue: {currentLanguageInfo?.flag} {currentLanguageInfo?.name}
              </div>
              {isTranslationEnabled && (
                <div className="text-xs opacity-80 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  IA activée
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Badge de statut */}
        {(isTranslationEnabled || currentLanguage !== 'fr') && (
          <div className="absolute -top-2 -left-2">
            <Badge 
              variant={isTranslationEnabled ? "default" : "secondary"}
              className="text-xs px-2 py-1 rounded-full"
            >
              {currentLanguageInfo?.flag}
            </Badge>
          </div>
        )}
      </div>

      {/* Modal de paramètres */}
      <LanguageSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default LanguageSettingsButton;
