import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  Palette,
  Globe,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme, ThemeMode, ThemePreset } from "@/context/ThemeContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t, languages } = useLanguage();
  const { mode, preset, setMode, setPreset, isDark, presets } = useTheme();

  const handleSave = () => {
    toast.success(t("settings.save"));
    onClose();
  };

  const handleReset = () => {
    setMode("dark");
    setPreset("default");
    setLanguage("fr");
    toast.success(t("settings.reset"));
  };

  const getModeIcon = (themeMode: ThemeMode) => {
    switch (themeMode) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      case "system":
        return <Monitor className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getPresetPreview = (presetId: ThemePreset) => {
    const presetData = presets.find(p => p.id === presetId);
    if (!presetData) return null;

    return (
      <div className="flex space-x-1">
        <div 
          className="w-3 h-3 rounded-full border border-white/20" 
          style={{ backgroundColor: `hsl(${presetData.colors["--primary"]})` }}
        />
        <div 
          className="w-3 h-3 rounded-full border border-white/20" 
          style={{ backgroundColor: `hsl(${presetData.colors["--secondary"]})` }}
        />
        <div 
          className="w-3 h-3 rounded-full border border-white/20" 
          style={{ backgroundColor: `hsl(${presetData.colors["--accent"]})` }}
        />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>{t("settings.title")}</span>
          </DialogTitle>
          <DialogDescription>
            Personnalisez l'apparence et la langue de l'application
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Language Settings */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <Label className="text-base font-medium">{t("settings.language")}</Label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={language === lang.code ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "justify-start text-left h-auto p-3",
                      language === lang.code && "ring-2 ring-primary"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{lang.flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-xs">{lang.name}</span>
                        <span className="text-xs text-muted-foreground uppercase">
                          {lang.code}
                        </span>
                      </div>
                      {language === lang.code && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Theme Mode */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <Label className="text-base font-medium">Mode d'affichage</Label>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {(["light", "dark", "system"] as ThemeMode[]).map((themeMode) => (
                  <Button
                    key={themeMode}
                    variant={mode === themeMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMode(themeMode)}
                    className={cn(
                      "justify-start h-auto p-3",
                      mode === themeMode && "ring-2 ring-primary"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      {getModeIcon(themeMode)}
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-xs capitalize">
                          {t(`theme.${themeMode}`)}
                        </span>
                        {themeMode === "system" && (
                          <span className="text-xs text-muted-foreground">
                            {isDark ? "Sombre" : "Clair"}
                          </span>
                        )}
                      </div>
                      {mode === themeMode && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Theme Presets */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <Label className="text-base font-medium">{t("settings.theme")}</Label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {presets.map((presetData) => (
                  <Button
                    key={presetData.id}
                    variant={preset === presetData.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreset(presetData.id)}
                    className={cn(
                      "justify-start h-auto p-3",
                      preset === presetData.id && "ring-2 ring-primary"
                    )}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      {getPresetPreview(presetData.id)}
                      <div className="flex flex-col items-start flex-1">
                        <span className="font-medium text-xs">{presetData.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {presetData.id}
                        </span>
                      </div>
                      {preset === presetData.id && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Current Settings Summary */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Configuration actuelle</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>{languages.find(l => l.code === language)?.name}</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  {getModeIcon(mode)}
                  <span>{t(`theme.${mode}`)}</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Palette className="w-3 h-3" />
                  <span>{presets.find(p => p.id === preset)?.name}</span>
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t("settings.reset")}</span>
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>{t("settings.cancel")}</span>
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>{t("settings.save")}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
