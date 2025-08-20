import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  Link,
  User,
  Camera,
  Save,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useUser();
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("url");

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image valide");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image doit faire moins de 5MB");
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setActiveTab("file");
    }
  };

  // Convert file to base64 for storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle save profile
  const handleSave = async () => {
    if (!currentUser) return;

    setIsUploading(true);
    try {
      let finalAvatarUrl = "";

      if (activeTab === "file" && imageFile) {
        // Convert file to base64 for storage
        finalAvatarUrl = await fileToBase64(imageFile);
      } else if (activeTab === "url" && avatarUrl.trim()) {
        // Validate URL
        try {
          new URL(avatarUrl);
          finalAvatarUrl = avatarUrl.trim();
        } catch {
          toast.error("Veuillez entrer une URL valide");
          setIsUploading(false);
          return;
        }
      }

      // Update user profile in Firebase
      await updateDoc(doc(db, "users", currentUser.id), {
        avatarUrl: finalAvatarUrl,
      });

      toast.success("Photo de profil mise à jour avec succès!");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour de la photo de profil");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle remove avatar
  const handleRemoveAvatar = async () => {
    if (!currentUser) return;

    setIsUploading(true);
    try {
      await updateDoc(doc(db, "users", currentUser.id), {
        avatarUrl: "",
      });

      setAvatarUrl("");
      setImageFile(null);
      setPreviewUrl("");
      toast.success("Photo de profil supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de la photo de profil");
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up preview URL on component unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Get display avatar URL
  const getDisplayAvatarUrl = () => {
    if (activeTab === "file" && previewUrl) return previewUrl;
    if (activeTab === "url" && avatarUrl) return avatarUrl;
    return currentUser?.avatarUrl || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <span>Personnaliser le profil</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choisissez votre photo de profil
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-gray-700">
                <AvatarImage 
                  src={getDisplayAvatarUrl()} 
                  alt={currentUser?.username || "Avatar"}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                  {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              {(currentUser?.avatarUrl || getDisplayAvatarUrl()) && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
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

            <TabsContent value="url" className="space-y-4 mt-4">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Label htmlFor="avatarUrl" className="text-white text-sm flex items-center space-x-2">
                      <Link className="w-4 h-4" />
                      <span>URL de l'image</span>
                    </Label>
                    <Input
                      id="avatarUrl"
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://exemple.com/avatar.jpg"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <p className="text-gray-500 text-xs">
                      Collez l'URL d'une image depuis internet
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="file" className="space-y-4 mt-4">
              <Card className="border-gray-700 bg-gray-800/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Label className="text-white text-sm flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Télécharger une image</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-gray-800 border-gray-700 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1"
                      />
                    </div>
                    <p className="text-gray-500 text-xs">
                      Formats supportés: JPG, PNG, GIF (max 5MB)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-300"
            disabled={isUploading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUploading || (!avatarUrl.trim() && !imageFile)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isUploading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
