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
import { RefreshCw, User } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ isOpen, onClose }) => {
  const { createUsername, generateRandomUsername } = useUser();
  const [username, setUsername] = useState(generateRandomUsername());
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setIsLoading(true);
    try {
      await createUsername(username.trim());
      // Mark that user has created a username to never show popup again
      localStorage.setItem("hasCreatedUser", "true");
      toast.success(`Welcome, ${username}!`);
      onClose();
    } catch (error) {
      console.error("Error creating username:", error);
      if (
        error instanceof Error &&
        error.message === "Username already exists"
      ) {
        toast.error(
          "This username is already taken. Please choose another one.",
        );
      } else {
        toast.error("Failed to create username. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewUsername = () => {
    setUsername(generateRandomUsername());
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="bg-gray-900/95 border-gray-800 backdrop-blur-xl max-w-md"
        hideClose
      >
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold text-white">
            Bienvenue !
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Créez votre nom d'utilisateur pour accéder à la plateforme
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white text-sm">
              Nom d'utilisateur
            </Label>
            <div className="flex space-x-2">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white flex-1"
                placeholder="Entrez votre pseudo"
                maxLength={20}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCreateUser();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={generateNewUsername}
                className="border-gray-700 hover:bg-gray-800"
                title="Générer un nouveau pseudo"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Ou utilisez le pseudo généré automatiquement
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2">
          <Button
            onClick={handleCreateUser}
            disabled={isLoading || !username.trim()}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>
          <div className="text-xs text-gray-500 text-center">
            Votre pseudo sera visible par les autres utilisateurs
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameModal;
