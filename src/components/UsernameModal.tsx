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
import { RefreshCw, User, Camera, Upload, Link, SkipForward, UserPlus, Plus, FileImage } from "lucide-react";
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
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setActiveTab("file");
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
      toast.error("Please enter a username");
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
            toast.error("Invalid image URL");
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
      toast.success(`Welcome, ${username}!`);
      onClose();
    } catch (error) {
      console.error("Error creating username:", error);
      if (
        error instanceof Error &&
        error.message === "Username already exists"
      ) {
        toast.error("This username already exists. Please choose another one.");
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipAvatar = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setIsLoading(true);
    try {
      await createUsername(username.trim());
      localStorage.setItem("hasCreatedUser", "true");
      toast.success(`Welcome, ${username}!`);
      onClose();
    } catch (error) {
      console.error("Error creating username:", error);
      toast.error("Failed to create account. Please try again.");
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
        className="bg-black/95 border-gray-800 backdrop-blur-xl max-w-md"
        hideClose
      >
        <DialogHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            {step === 1 ? <User className="w-8 h-8 text-white" /> : <Camera className="w-8 h-8 text-white" />}
          </div>
          <DialogTitle className="text-xl font-semibold text-white">
            {step === 1 ? "Welcome!" : "Profile Picture"}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {step === 1 
              ? "Create your username to access the platform"
              : "Add a profile picture (optional)"
            }
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          // Step 1: Username
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white text-sm">
                Username
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 flex-1"
                  placeholder="Enter your username"
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
                  className="border-gray-600 hover:bg-gray-800"
                  title="Generate new username"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                Or use the automatically generated username
              </div>
            </div>
          </div>
        ) : (
          // Step 2: Avatar
          <div className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex justify-center">
              <Avatar className="w-24 h-24 border-4 border-purple-500/30">
                <AvatarImage 
                  src={getDisplayAvatarUrl()} 
                  alt={username}
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-2xl">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Upload Options */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900/80 border border-gray-700">
                <TabsTrigger value="file" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="url" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Link className="w-4 h-4 mr-2" />
                  URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-3 mt-4">
                {/* Enhanced File Upload Zone */}
                <div
                  className={`
                    relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer
                    ${isDragOver 
                      ? 'border-purple-400 bg-purple-500/10' 
                      : 'border-gray-600 bg-gray-900/50 hover:border-purple-500 hover:bg-gray-900/80'
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      {imageFile ? (
                        <FileImage className="w-6 h-6 text-white" />
                      ) : (
                        <Plus className="w-6 h-6 text-white" />
                      )}
                    </div>
                    
                    <div>
                      <p className="text-white text-sm font-medium">
                        {imageFile ? imageFile.name : "Choose an image"}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {imageFile 
                          ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`
                          : "Drag & drop or click to browse"
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-xs text-center">
                  Supported: JPG, PNG, GIF (max 5MB)
                </p>
              </TabsContent>

              <TabsContent value="url" className="space-y-3 mt-4">
                <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Label htmlFor="avatarUrl" className="text-white text-sm flex items-center space-x-2">
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
        )}

        <DialogFooter className="flex-col space-y-2">
          {step === 1 ? (
            <Button
              onClick={handleCreateUser}
              disabled={isLoading || !username.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Continue
                </>
              )}
            </Button>
          ) : (
            <div className="flex space-x-2 w-full">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={isLoading}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleSkipAvatar}
                disabled={isLoading}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
              <Button
                onClick={handleCreateUser}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          )}
          <div className="text-xs text-gray-500 text-center">
            {step === 1 
              ? "Your username will be visible to other users"
              : "You can change your picture later"
            }
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameModal;
