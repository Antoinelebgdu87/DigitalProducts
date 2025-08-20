import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Languages, FileText, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
      title: "Terms of Service",
      description: "Please accept our Terms to continue",
      toggleBtn: "FR",
      acceptBtn: "Accept",
      declineBtn: "Decline",
      viewFullBtn: "Read Full Terms",
      keyPoints: [
        "All sales final - NO REFUNDS",
        "Products provided 'as is'",
        "Personal license only"
      ],
      notice: "By accepting, you agree to our complete Terms of Service."
    },
    fr: {
      title: "Conditions d'Utilisation", 
      description: "Veuillez accepter nos Conditions pour continuer",
      toggleBtn: "EN",
      acceptBtn: "Accepter",
      declineBtn: "Refuser",
      viewFullBtn: "Lire les Conditions",
      keyPoints: [
        "Ventes finales - AUCUN REMBOURSEMENT",
        "Produits fournis 'en l'état'",
        "Licence personnelle uniquement"
      ],
      notice: "En acceptant, vous acceptez nos Conditions d'Utilisation complètes."
    }
  };

  const currentContent = content[language];

  const handleViewFullTerms = () => {
    navigate('/terms');
    onClose();
  };

  const handleAccept = () => {
    localStorage.setItem('tosAccepted', 'true');
    localStorage.setItem('tosAcceptedDate', new Date().toISOString());
    onAccept();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md bg-black/95 border border-white/20 p-6 rounded-2xl backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-400" />
                    <DialogTitle className="text-white text-lg font-bold">
                      {currentContent.title}
                    </DialogTitle>
                  </div>
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                    className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
                  >
                    {currentContent.toggleBtn}
                  </button>
                </div>
                <DialogDescription className="text-gray-400 text-sm">
                  {currentContent.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Key Points */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <ul className="space-y-1">
                    {currentContent.keyPoints.map((point, index) => (
                      <li key={index} className="text-gray-300 text-xs flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Notice */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  {currentContent.notice}
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleViewFullTerms}
                    className="flex-1 px-3 py-2 text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-gray-300 hover:text-white rounded-xl transition-all"
                  >
                    <ExternalLink className="h-3 w-3 inline mr-1" />
                    {currentContent.viewFullBtn}
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 text-sm bg-transparent hover:bg-white/10 border border-white/20 text-gray-400 hover:text-white rounded-xl transition-all"
                  >
                    {currentContent.declineBtn}
                  </button>
                  <button
                    onClick={handleAccept}
                    className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all"
                  >
                    {currentContent.acceptBtn}
                  </button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default TosModal;
