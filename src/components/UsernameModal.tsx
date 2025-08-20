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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, User, Camera, Upload, Link, SkipForward, UserPlus } from "lucide-react";
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
  const [step, setStep] = useState(1); // 1: username, 2: avatar
  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState("url");

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image valide");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image doit faire moins de 5MB");
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setActiveTab("file");
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleCreateUser = async () => {
    if (!username.trim()) {
      toast.error("Veuillez entrer un nom d'utilisateur");
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    try {
      // First create the user
      const user = await createUsername(username.trim());

      // Then update avatar if provided
      if ((activeTab === "url" && avatarUrl.trim()) || (activeTab === "file" && imageFile)) {
        const { updateDoc, doc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        let finalAvatarUrl = "";
        if (activeTab === "file" && imageFile) {
          finalAvatarUrl = await fileToBase64(imageFile);
        } else if (activeTab === "url" && avatarUrl.trim()) {
          try {
            new URL(avatarUrl);
            finalAvatarUrl = avatarUrl.trim();
          } catch {
            toast.error("URL d'image invalide");
            setIsLoading(false);
            return;
          }
        }

        if (finalAvatarUrl) {
          await updateDoc(doc(db, "users", user.id), {
            avatarUrl: finalAvatarUrl,
          });
        }
      }

      localStorage.setItem("hasCreatedUser", "true");
      toast.success(`Bienvenue, ${username}!`);
      onClose();
    } catch (error) {
      console.error("Error creating username:", error);
      if (
        error instanceof Error &&
        error.message === "Username already exists"
      ) {
        toast.error(
          "Ce nom d'utilisateur existe déjà. Choisissez-en un autre.",
        );
      } else {
        toast.error("Erreur lors de la création du compte. Réessayez.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipAvatar = async () => {
    if (!username.trim()) {
      toast.error("Veuillez entrer un nom d'utilisateur");
      return;
    }

    setIsLoading(true);
    try {
      await createUsername(username.trim());
      localStorage.setItem("hasCreatedUser", "true");
      toast.success(`Bienvenue, ${username}!`);
      onClose();
    } catch (error) {
      console.error("Error creating username:", error);
      toast.error("Erreur lors de la création du compte. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
  };

  const generateNewUsername = () => {
    setUsername(generateRandomUsername());
  };

  // Get display avatar URL
  const getDisplayAvatarUrl = () => {
    if (activeTab === "file" && previewUrl) return previewUrl;
    if (activeTab === "url" && avatarUrl) return avatarUrl;
    return "";
  };

  // Clean up preview URL
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="bg-gray-900/95 border-gray-800 backdrop-blur-xl max-w-md"
        hideClose
      >
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            {step === 1 ? <User className="w-8 h-8 text-white" /> : <Camera className="w-8 h-8 text-white" />}
          </div>
          <DialogTitle className="text-xl font-semibold text-white">
            {step === 1 ? "Bienvenue !" : "Photo de profil"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === 1
              ? "Créez votre nom d'utilisateur pour accéder à la plateforme"
              : "Ajoutez une photo de profil (optionnel)"
            }
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          // Step 1: Username
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
        ) : (
          // Step 2: Avatar
          <div className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex justify-center">
              <Avatar className="w-24 h-24 border-4 border-gray-700">
                <AvatarImage
                  src={getDisplayAvatarUrl()}
                  alt={username}
                />
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-600 text-white text-2xl">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Upload Options */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="url" className="text-gray-300">
                  <Link className="w-4 h-4 mr-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="file" className="text-gray-300">
                  <Upload className="w-4 h-4 mr-2" />
                  Fichier
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-3 mt-4">
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl" className="text-white text-sm">
                        URL de l'image
                      </Label>
                      <Input
                        id="avatarUrl"
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://exemple.com/avatar.jpg"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="file" className="space-y-3 mt-4">
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <Label className="text-white text-sm">
                        Télécharger une image
                      </Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-gray-800 border-gray-700 text-white file:bg-red-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1"
                      />
                      <p className="text-gray-500 text-xs">
                        JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter className="flex-col space-y-2">
          {step === 1 ? (
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
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Continuer
                </>
              )}
            </Button>
          ) : (
            <div className="flex space-x-2 w-full">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={isLoading}
                className="flex-1 border-gray-700 text-gray-300"
              >
                Retour
              </Button>
              <Button
                variant="outline"
                onClick={handleSkipAvatar}
                disabled={isLoading}
                className="flex-1 border-gray-700 text-gray-300"
              >
                <Skip className="w-4 h-4 mr-2" />
                Ignorer
              </Button>
              <Button
                onClick={handleCreateUser}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Créer"
                )}
              </Button>
            </div>
          )}
          <div className="text-xs text-gray-500 text-center">
            {step === 1
              ? "Votre pseudo sera visible par les autres utilisateurs"
              : "Vous pourrez changer votre photo plus tard"
            }
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameModal;
