import React, { useState, useEffect } from "react";
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
import { Shield, Lock, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const SecureAdminAccess: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Listener for Ctrl + F1
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "F1") {
        event.preventDefault();
        console.log("🔐 Séquence d'accès admin détectée");
        setIsOpen(true);
        setUsername("");
        setPassword("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        toast.success("🎉 Connexion réussie ! Redirection...");
        setTimeout(() => {
          setIsOpen(false);
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        toast.error("Identifiants incorrects");
        setPassword("");
      }
      setIsVerifying(false);
    }, 800);
  };

  const handleClose = () => {
    setIsOpen(false);
    setUsername("");
    setPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-red-500/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-400" />
            <span>Connexion Admin Rapide</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Entrez vos identifiants administrateur
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white text-sm">
                Nom d'utilisateur
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom d'utilisateur..."
                className="bg-gray-800 border-gray-700 text-white"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe..."
                  className="bg-gray-800 border-gray-700 text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!username.trim() || !password.trim() || isVerifying}
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              {isVerifying ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-xs">
                Accès rapide administrateur - Utilisez Ctrl+F1
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecureAdminAccess;
