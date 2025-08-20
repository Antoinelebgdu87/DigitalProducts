import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Languages, FileText, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TosModal: React.FC<TosModalProps> = ({ isOpen, onClose, onAccept }) => {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Terms of Service Agreement",
      description: "Please read and accept our Terms of Service to continue using DigitalHub.",
      toggleBtn: "Français",
      acceptBtn: "I Accept Terms",
      declineBtn: "Decline",
      viewFullBtn: "View Full Terms",
      summary: {
        title: "Summary of Key Terms:",
        points: [
          "All sales are final - NO REFUNDS under any circumstances",
          "Digital products are provided 'as is' without warranty",
          "You receive a personal, non-transferable license",
          "Redistribution or resale of products is prohibited",
          "Account termination may occur for violations",
          "French law governs these terms"
        ]
      },
      notice: "By clicking 'I Accept Terms', you acknowledge that you have read, understood, and agree to be bound by our complete Terms of Service."
    },
    fr: {
      title: "Accord des Conditions d'Utilisation",
      description: "Veuillez lire et accepter nos Conditions d'Utilisation pour continuer à utiliser DigitalHub.",
      toggleBtn: "English",
      acceptBtn: "J'Accepte les Conditions",
      declineBtn: "Refuser",
      viewFullBtn: "Voir les Conditions Complètes",
      summary: {
        title: "Résumé des Conditions Principales :",
        points: [
          "Toutes les ventes sont finales - AUCUN REMBOURSEMENT en toutes circonstances",
          "Les produits numériques sont fournis 'en l'état' sans garantie",
          "Vous recevez une licence personnelle et non transférable",
          "La redistribution ou revente de produits est interdite",
          "La résiliation de compte peut survenir en cas de violations",
          "Le droit français régit ces conditions"
        ]
      },
      notice: "En cliquant sur 'J'Accepte les Conditions', vous reconnaissez avoir lu, compris et accepté d'être lié par nos Conditions d'Utilisation complètes."
    }
  };

  const currentContent = content[language];

  const handleViewFullTerms = () => {
    navigate('/terms');
    onClose();
  };

  const handleAccept = () => {
    // Mark that user has accepted ToS
    localStorage.setItem('tosAccepted', 'true');
    localStorage.setItem('tosAcceptedDate', new Date().toISOString());
    onAccept();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-gray-900 border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-white" />
              <DialogTitle className="text-white text-xl">
                {currentContent.title}
              </DialogTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Languages className="h-4 w-4 mr-1" />
              {currentContent.toggleBtn}
            </Button>
          </div>
          <DialogDescription className="text-gray-400">
            {currentContent.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              {currentContent.summary.title}
            </h3>
            <ScrollArea className="h-48">
              <ul className="space-y-2">
                {currentContent.summary.points.map((point, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>

          {/* Important Notice */}
          <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm font-medium">
              {currentContent.notice}
            </p>
          </div>

          <Separator className="bg-gray-700" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleViewFullTerms}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {currentContent.viewFullBtn}
            </Button>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                {currentContent.declineBtn}
              </Button>
              <Button
                onClick={handleAccept}
                className="bg-white text-black hover:bg-gray-200"
              >
                {currentContent.acceptBtn}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TosModal;
