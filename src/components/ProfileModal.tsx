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
  FileImage,
  Plus,
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
  const [activeTab, setActiveTab] = useState("file");
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setActiveTab("file");
  };

  // Convert file to base64 for storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
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
          toast.error("Please enter a valid URL");
          setIsUploading(false);
          return;
        }
      }

      // Update user profile in Firebase
      await updateDoc(doc(db, "users", currentUser.id), {
        avatarUrl: finalAvatarUrl,
      });

      console.log("✅ Avatar updated in Firebase:", finalAvatarUrl);
      toast.success("Profile picture updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile picture");
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
      toast.success("Profile picture removed");
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast.error("Failed to remove profile picture");
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
      <DialogContent className="bg-black/95 border-gray-800 max-w-md backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Camera className="w-5 h-5 text-purple-400" />
            <span>Customize Profile</span>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose your profile picture
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-purple-500/30 shadow-2xl shadow-purple-500/20">
                <AvatarImage
                  src={getDisplayAvatarUrl()}
                  alt={currentUser?.username || "Avatar"}
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-3xl">
                  {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              {(currentUser?.avatarUrl || getDisplayAvatarUrl()) && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 bg-red-500 hover:bg-red-600 border-2 border-black"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Upload Options */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/80 border border-gray-700">
              <TabsTrigger
                value="file"
                className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Link className="w-4 h-4 mr-2" />
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4 mt-6">
              {/* Enhanced File Upload Zone */}
              <div
                className={`
                  relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
                  ${
                    isDragOver
                      ? "border-purple-400 bg-purple-500/10"
                      : "border-gray-600 bg-gray-900/50 hover:border-purple-500 hover:bg-gray-900/80"
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    {imageFile ? (
                      <FileImage className="w-8 h-8 text-white" />
                    ) : (
                      <Plus className="w-8 h-8 text-white" />
                    )}
                  </div>

                  <div>
                    <p className="text-white font-medium">
                      {imageFile ? imageFile.name : "Choose an image"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {imageFile
                        ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`
                        : "Drag & drop or click to browse"}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("file-input")?.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {imageFile ? "Change File" : "Select File"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-500 text-xs">
                  Supported formats: JPG, PNG, GIF • Max size: 5MB
                </p>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-6">
              <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Label
                      htmlFor="avatarUrl"
                      className="text-white text-sm flex items-center space-x-2"
                    >
                      <Link className="w-4 h-4 text-purple-400" />
                      <span>Image URL</span>
                    </Label>
                    <Input
                      id="avatarUrl"
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="bg-black/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500"
                    />
                    <p className="text-gray-500 text-xs">
                      Paste an image URL from the internet
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUploading || (!avatarUrl.trim() && !imageFile)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isUploading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
