import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Globe, Loader2, Sparkles } from "lucide-react";
import {
  useTranslation,
  AVAILABLE_LANGUAGES,
  type Language,
} from "@/context/TranslationContext";

interface LanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSettingsModal: React.FC<LanguageSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentLanguage,
    isTranslating,
    setLanguage,
    isTranslationEnabled,
    toggleTranslation,
  } = useTranslation();

  const handleLanguageSelect = async (language: Language) => {
    await setLanguage(language);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres de traduction
          </DialogTitle>
          <DialogDescription>
            Configurez la langue d'affichage et activez la traduction
            automatique avec IA.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Toggle de traduction IA */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <Label
                  htmlFor="translation-toggle"
                  className="text-sm font-medium"
                >
                  Traduction IA
                </Label>
                <Badge variant="secondary" className="text-xs">
                  Gratuit
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Activez la traduction automatique de tous les textes avec
                OpenRouter AI
              </p>
            </div>
            <Switch
              id="translation-toggle"
              checked={isTranslationEnabled}
              onCheckedChange={toggleTranslation}
              disabled={isTranslating}
            />
          </div>

          {/* Indicateur de traduction en cours */}
          {isTranslating && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-primary">
                Traduction en cours...
              </span>
            </div>
          )}

          {/* Sélection de langue */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <Label className="text-sm font-medium">Langue d'affichage</Label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_LANGUAGES.map((language) => (
                <Button
                  key={language.code}
                  variant={
                    currentLanguage === language.code ? "default" : "outline"
                  }
                  className="h-auto p-3 justify-start"
                  onClick={() => handleLanguageSelect(language.code)}
                  disabled={isTranslating}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-lg">{language.flag}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium">{language.name}</div>
                      <div className="text-xs opacity-60">
                        {language.code.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Informations sur le service */}
          <div className="p-4 bg-muted/30 border rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Service de traduction</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Traduction hybride avec dictionnaire intégré et API LibreTranslate
              gratuite. Les traductions sont mises en cache pour des
              performances optimales.
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-primary">
                {Object.keys(useTranslation().translations).length}
              </div>
              <div className="text-xs text-muted-foreground">
                Textes traduits
              </div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-green-500">
                {currentLanguage === "fr" ? "Original" : "Traduit"}
              </div>
              <div className="text-xs text-muted-foreground">Mode actuel</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSettingsModal;
