import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Lock, Key, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SecureAdminAccess: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: password, 2: code verification
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  // Listener for Ctrl + F1
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "F1") {
        event.preventDefault();
        console.log("🔐 Séquence d'accès admin détectée");
        setIsOpen(true);
        setStep(1);
        setPassword("");
        setVerificationCode("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simuler la vérification du mot de passe
    if (password === "admin123") { // Vous pouvez changer ce mot de passe
      setStep(2);
      toast.success("Mot de passe correct, entrez le code de vérification");
    } else {
      toast.error("Mot de passe incorrect");
      setPassword("");
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      if (verificationCode === "2011") {
        toast.success("🎉 Accès autorisé ! Redirection...");
        setTimeout(() => {
          setIsOpen(false);
          navigate("/admin");
        }, 1000);
      } else {
        toast.error("Code de vérification incorrect");
        setVerificationCode("");
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
    setPassword("");
    setVerificationCode("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-red-500/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-400" />
            <span>Accès Sécurisé Admin</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === 1 
              ? "Entrez le mot de passe administrateur" 
              : "Entrez le code de vérification"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Indicator */}
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-green-400' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                step >= 1 ? 'border-green-400 bg-green-400/20' : 'border-gray-500'
              }`}>
                {step > 1 ? <Lock className="w-3 h-3" /> : "1"}
              </div>
              <span className="text-sm">Mot de passe</span>
            </div>
            
            <div className="flex-1 h-px bg-gray-600"></div>
            
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-green-400' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                step >= 2 ? 'border-green-400 bg-green-400/20' : 'border-gray-500'
              }`}>
                {step > 2 ? <Key className="w-3 h-3" /> : "2"}
              </div>
              <span className="text-sm">Code</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white text-sm">
                      Mot de passe administrateur
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Entrez le mot de passe..."
                        className="bg-gray-800 border-gray-700 text-white pr-10"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={!password.trim()}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Vérifier mot de passe
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleCodeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-white text-sm">
                      Code de vérification
                    </Label>
                    <Input
                      id="code"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Entrez le code..."
                      className="bg-gray-800 border-gray-700 text-white text-center text-lg tracking-widest"
                      maxLength={4}
                      required
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 text-center">
                      Entrez le code de sécurité à 4 chiffres
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 border-gray-600 text-gray-300"
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={verificationCode.length !== 4 || isVerifying}
                    >
                      {isVerifying ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Key className="w-4 h-4 mr-2" />
                      )}
                      {isVerifying ? "Vérification..." : "Accéder"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-xs">
                Accès restreint aux administrateurs autorisés uniquement
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecureAdminAccess;
