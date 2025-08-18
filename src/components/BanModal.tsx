import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface BanModalProps {
  isOpen: boolean;
  reason: string;
}

const BanModal: React.FC<BanModalProps> = ({ isOpen, reason }) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-red-900/95 border-red-700 backdrop-blur-xl max-w-md"
        hideClose
      >
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center animate-pulse-glow">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            Vous êtes banni
          </DialogTitle>
          <DialogDescription className="text-red-200 mt-4">
            <div className="bg-red-800/50 rounded-lg p-4 border border-red-600">
              <p className="font-semibold text-white mb-2">Raison du bannissement :</p>
              <p className="text-red-100">{reason}</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="text-center mt-6">
          <p className="text-red-200 text-sm">
            Votre accès à la plateforme a été restreint de manière permanente.
          </p>
          <p className="text-red-300 text-xs mt-2">
            Cette décision est définitive et ne peut pas être contestée.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BanModal;
