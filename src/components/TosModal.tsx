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
import { Languages, FileText, ExternalLink, Shield, AlertTriangle, CheckCircle } from "lucide-react";
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
      subtitle: "Legal Agreement Required",
      description: "Please review and accept our Terms of Service to continue using DigitalHub.",
      toggleBtn: "Français",
      acceptBtn: "I Accept & Continue",
      declineBtn: "Decline",
      viewFullBtn: "View Complete Terms",
      summary: {
        title: "Key Terms Summary",
        points: [
          "All sales are final - NO REFUNDS under any circumstances",
          "Digital products are provided 'as is' without warranty",
          "You receive a personal, non-transferable license",
          "Redistribution or resale of products is prohibited",
          "Account termination may occur for violations",
          "French law governs these terms"
        ]
      },
      notice: "By clicking 'I Accept & Continue', you acknowledge that you have read, understood, and agree to be bound by our complete Terms of Service.",
      importance: "This agreement is legally binding and affects your rights."
    },
    fr: {
      title: "Conditions d'Utilisation",
      subtitle: "Accord Légal Requis",
      description: "Veuillez examiner et accepter nos Conditions d'Utilisation pour continuer à utiliser DigitalHub.",
      toggleBtn: "English",
      acceptBtn: "J'Accepte et Continue",
      declineBtn: "Refuser",
      viewFullBtn: "Voir les Conditions Complètes",
      summary: {
        title: "Résumé des Conditions Principales",
        points: [
          "Toutes les ventes sont finales - AUCUN REMBOURSEMENT en toutes circonstances",
          "Les produits numériques sont fournis 'en l'état' sans garantie",
          "Vous recevez une licence personnelle et non transférable",
          "La redistribution ou revente de produits est interdite",
          "La résiliation de compte peut survenir en cas de violations",
          "Le droit français régit ces conditions"
        ]
      },
      notice: "En cliquant sur 'J'Accepte et Continue', vous reconnaissez avoir lu, compris et accepté d'être lié par nos Conditions d'Utilisation complètes.",
      importance: "Cet accord est juridiquement contraignant et affecte vos droits."
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
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-0 p-0 rounded-3xl overflow-hidden backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-gray-950/30" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]" />
              
              <div className="relative z-10 p-8">
                <DialogHeader className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-2xl border border-red-500/30 backdrop-blur-sm">
                        <FileText className="h-8 w-8 text-red-400" />
                      </div>
                      <div>
                        <DialogTitle className="text-white text-3xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                          {currentContent.title}
                        </DialogTitle>
                        <p className="text-red-400 text-lg font-medium mt-1">
                          {currentContent.subtitle}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.button
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur-sm transition-all duration-300"
                    >
                      <Languages className="h-4 w-4 text-red-400" />
                      <span className="text-white font-medium">{currentContent.toggleBtn}</span>
                    </motion.button>
                  </div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <DialogDescription className="text-gray-300 text-lg leading-relaxed">
                      {currentContent.description}
                    </DialogDescription>
                  </motion.div>
                </DialogHeader>

                <div className="space-y-8">
                  {/* Important Notice */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-red-950/40 to-red-900/30 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-red-500/20 rounded-xl">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-red-300 font-bold text-lg mb-2">
                          {currentContent.importance}
                        </h3>
                        <p className="text-red-200 leading-relaxed">
                          {currentContent.notice}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Terms Summary */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-white/10 rounded-xl">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-xl">
                        {currentContent.summary.title}
                      </h3>
                    </div>
                    
                    <ScrollArea className="h-64">
                      <div className="space-y-4 pr-4">
                        {currentContent.summary.points.map((point, index) => (
                          <motion.div
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                          >
                            <div className="p-1 bg-red-500/20 rounded-lg mt-0.5">
                              <CheckCircle className="h-4 w-4 text-red-400" />
                            </div>
                            <span className="text-gray-300 leading-relaxed flex-1">
                              {point}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </motion.div>

                  <Separator className="bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col lg:flex-row gap-4 justify-between"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleViewFullTerms}
                      className="flex items-center justify-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl backdrop-blur-sm transition-all duration-300"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span className="font-medium">{currentContent.viewFullBtn}</span>
                    </motion.button>
                    
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="px-8 py-3 bg-transparent hover:bg-white/10 border border-white/20 text-gray-400 hover:text-white rounded-2xl transition-all duration-300"
                      >
                        {currentContent.declineBtn}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(220, 38, 38, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAccept}
                        className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/25 transition-all duration-300"
                      >
                        {currentContent.acceptBtn}
                      </motion.button>
                    </div>
                  </motion.div>
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
