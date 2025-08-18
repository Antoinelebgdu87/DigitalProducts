import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Warning } from "@/context/UserContext";

interface WarningModalProps {
  isOpen: boolean;
  warnings: Warning[];
  onClose: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ isOpen, warnings, onClose }) => {
  const unreadWarnings = warnings.filter(w => !w.isRead);

  if (unreadWarnings.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-orange-900/95 border-orange-700 backdrop-blur-xl max-w-md"
        hideClose
      >
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-600 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            {unreadWarnings.length === 1 ? "Nouvel avertissement" : "Nouveaux avertissements"}
          </DialogTitle>
          <DialogDescription className="text-orange-200 mt-4">
            <div className="space-y-3">
              {unreadWarnings.map((warning) => (
                <div 
                  key={warning.id}
                  className="bg-orange-800/50 rounded-lg p-4 border border-orange-600"
                >
                  <p className="font-semibold text-white mb-2">Avertissement :</p>
                  <p className="text-orange-100">{warning.reason}</p>
                  <p className="text-orange-300 text-xs mt-2">
                    {warning.createdAt.toLocaleString("fr-FR")}
                  </p>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="text-center mt-4">
          <p className="text-orange-200 text-sm">
            Veuillez respecter les règles de la plateforme pour éviter de futurs avertissements.
          </p>
          <p className="text-orange-300 text-xs mt-2">
            Les avertissements répétés peuvent conduire à un bannissement.
          </p>
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            J'ai compris
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningModal;
