import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LicenseInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (licenseCode: string) => Promise<void>;
  productTitle: string;
}

const LicenseInput: React.FC<LicenseInputProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productTitle,
}) => {
  const [licenseCode, setLicenseCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseCode.trim()) {
      toast.error("Veuillez entrer une clé de licence");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(licenseCode.trim());
      toast.success("Licence validée ! Téléchargement en cours...");
      setLicenseCode("");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la validation",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatLicenseCode = (value: string) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const clean = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    // Add dashes every 4 characters
    let formatted = "";
    for (let i = 0; i < clean.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += "-";
      }
      formatted += clean[i];
    }

    // Limit to 19 characters (16 + 3 dashes)
    return formatted.substring(0, 19);
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatLicenseCode(e.target.value);
    setLicenseCode(formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader className="text-center">
          <DialogTitle className="text-white flex items-center justify-center gap-2">
            <Key className="w-5 h-5 text-red-500" />
            Licence requise
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Entrez votre clé de licence pour accéder à{" "}
            <span className="font-semibold text-red-400">{productTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="license" className="text-white">
              Clé de licence
            </Label>
            <Input
              id="license"
              value={licenseCode}
              onChange={handleLicenseChange}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
              maxLength={19}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !licenseCode.trim()}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validation...
                </>
              ) : (
                "Valider"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LicenseInput;
