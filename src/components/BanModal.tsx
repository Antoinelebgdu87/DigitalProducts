import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Clock } from "lucide-react";

interface BanModalProps {
  isOpen: boolean;
  reason: string;
  banExpiresAt?: Date | null;
  bannedAt?: Date;
}

const BanModal: React.FC<BanModalProps> = ({ isOpen, reason, banExpiresAt, bannedAt }) => {
  const isPermanent = !banExpiresAt;
  const isExpired = banExpiresAt && new Date() > banExpiresAt;

  // Calculer le temps restant si ban temporaire
  const getTimeRemaining = () => {
    if (!banExpiresAt || isPermanent) return null;

    const now = new Date();
    const timeLeft = banExpiresAt.getTime() - now.getTime();

    if (timeLeft <= 0) return null;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  };

  const timeRemaining = getTimeRemaining();

  // Si le ban a expiré, ne pas afficher le modal
  if (isExpired) {
    return null;
  }
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="bg-red-900/95 border-red-700 backdrop-blur-xl max-w-md"
        hideClose
      >
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center animate-pulse-glow">
            {isPermanent ? (
              <AlertTriangle className="w-8 h-8 text-white" />
            ) : (
              <Clock className="w-8 h-8 text-white" />
            )}
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            {isPermanent ? "Vous êtes banni" : "Accès temporairement restreint"}
          </DialogTitle>
          <DialogDescription className="text-red-200 mt-4">
            {isPermanent
              ? "Votre accès à la plateforme a été restreint de manière permanente."
              : `Votre accès à la plateforme est temporairement restreint${timeRemaining ? ` pour encore ${timeRemaining}` : ""}."`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-800/50 rounded-lg p-4 border border-red-600 mt-4">
          <div className="font-semibold text-white mb-2">
            Raison du bannissement :
          </div>
          <div className="text-red-100">{reason}</div>
        </div>

        <div className="text-center mt-6">
          <div className="text-red-200 text-sm">
            {isPermanent
              ? "Votre accès à la plateforme a été restreint de manière permanente."
              : `Restriction temporaire${timeRemaining ? ` - ${timeRemaining} restant` : ""}.`
            }
          </div>
          <div className="text-red-300 text-xs mt-2">
            {isPermanent
              ? "Cette décision est définitive et ne peut pas être contestée."
              : "Vous pourrez accéder à nouveau à la plateforme une fois la période écoulée."
            }
          </div>
          {banExpiresAt && !isPermanent && (
            <div className="text-red-400 text-xs mt-1">
              Fin de restriction : {banExpiresAt.toLocaleString('fr-FR')}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BanModal;
