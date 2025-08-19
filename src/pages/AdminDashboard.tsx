import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMaintenance } from "@/context/MaintenanceContext";
import { useProducts } from "@/hooks/useProducts";
import { useLicenses } from "@/hooks/useLicenses";
import { useModeration } from "@/hooks/useModeration";
import { useComments } from "@/hooks/useComments";
import { useAdminMode } from "@/context/AdminModeContext";
import HeaderLogo from "@/components/HeaderLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Plus,
  Package,
  Key,
  Settings,
  Trash2,
  Copy,
  Calendar,
  Download,
  Shield,
  User,
  UserCheck,
  CreditCard,
  Zap,
  Euro,
  Heart,
  Edit,
  FileText,
  Link as LinkIcon,
  AlertTriangle,
  Clock,
  MessageSquare,
  Store,
  Crown,
  Timer,
} from "lucide-react";
import SimpleStarsBackground from "@/components/SimpleStarsBackground";
import { toast } from "sonner";
import { Product } from "@/types";
import { useUser } from "@/context/UserContext";

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { isMaintenanceMode, maintenanceMessage, setMaintenanceMode } =
    useMaintenance();
  const {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    loading: productsLoading,
  } = useProducts();
  const {
    licenses,
    createLicense,
    deleteLicense,
    getActiveLicenses,
    loading: licensesLoading,
  } = useLicenses();
  const { users, banUser, unbanUser, addWarning, updateUserRole } = useUser();
  const {
    moderationActions,
    moderateDeleteProduct,
    moderateDeleteComment,
    getUserProducts,
    getModerationStats,
  } = useModeration();
  const { adminMode, timerSettings, updateTimerSettings } = useAdminMode();
  const { comments: allComments } = useComments();

  // Product form state
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    downloadUrl: "",
    type: "free" as "free" | "paid",
    actionType: "download" as "download" | "discord",
    contentType: "link" as "link" | "text",
    content: "",
    discordUrl: "",
    price: 0,
    lives: 1,
  });

  // License form state
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const [licenseForm, setLicenseForm] = useState({
    productId: "",
    category: "compte" as "compte" | "carte-cadeau" | "cheat",
    maxUsages: 1,
  });

  // Maintenance form state
  const [maintenanceForm, setMaintenanceForm] = useState({
    isActive: isMaintenanceMode,
    message: maintenanceMessage,
  });

  // User management states
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [showWarnDialog, setShowWarnDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUserRole, setSelectedUserRole] = useState<
    "user" | "shop_access" | "partner" | "admin"
  >("user");
  const [banReason, setBanReason] = useState("");
  const [warnReason, setWarnReason] = useState("");

  // Moderation states
  const [showModerationDialog, setShowModerationDialog] = useState(false);
  const [moderationTarget, setModerationTarget] = useState<{
    id: string;
    type: "product" | "comment";
    title: string;
  } | null>(null);
  const [moderationReason, setModerationReason] = useState("");

  // Timer settings states
  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [tempTimerSettings, setTempTimerSettings] = useState(timerSettings);

  // Product deletion states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{id: string, title: string} | null>(null);

  // License deletion states
  const [showDeleteLicenseDialog, setShowDeleteLicenseDialog] = useState(false);
  const [licenseToDelete, setLicenseToDelete] = useState<{id: string, code: string} | null>(null);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(productForm);
      toast.success("Product added successfully!");
      resetProductForm();
      setShowProductDialog(false);
    } catch (error) {
      toast.error("Error adding product");
    }
  };

  const resetProductForm = () => {
    setProductForm({
      title: "",
      description: "",
      imageUrl: "",
      downloadUrl: "",
      type: "free",
      actionType: "download",
      contentType: "link", // Par défaut lien pour compatibilité
      content: "",
      discordUrl: "",
      price: 0,
      lives: 1,
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl,
      downloadUrl: product.downloadUrl,
      type: product.type,
      actionType: product.actionType || "download",
      contentType: product.contentType || "link", // Par défaut lien pour compatibilité
      content: product.content || "",
      discordUrl: product.discordUrl || "",
      price: product.price || 0,
      lives: product.lives || 1,
    });
    setShowEditDialog(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, productForm);
      toast.success("Product updated successfully!");
      resetProductForm();
      setShowEditDialog(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error("Error updating product");
    }
  };

  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const code = await createLicense(
        licenseForm.productId,
        licenseForm.category,
        licenseForm.maxUsages,
      );
      toast.success("Key created successfully!");

      // Copy to clipboard
      navigator.clipboard.writeText(code);
      toast.info("Key code copied to clipboard");

      setLicenseForm({ productId: "", category: "compte", maxUsages: 1 });
      setShowLicenseDialog(false);
    } catch (error) {
      toast.error("Error creating key");
    }
  };

  const handleMaintenanceToggle = async () => {
    try {
      await setMaintenanceMode(
        maintenanceForm.isActive,
        maintenanceForm.message,
      );
      toast.success(
        `Maintenance mode ${maintenanceForm.isActive ? "enabled" : "disabled"}`,
      );
    } catch (error) {
      toast.error("Error updating maintenance mode");
    }
  };

  const copyLicenseCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const formatDate = (date: any) => {
    try {
      let validDate: Date;

      // Handle various date formats
      if (!date) {
        return "Date inconnue";
      }

      // If it's already a Date object
      if (date instanceof Date) {
        validDate = date;
      }
      // If it's a Firestore Timestamp (has toDate method)
      else if (date && typeof date.toDate === "function") {
        validDate = date.toDate();
      }
      // If it's a timestamp number
      else if (typeof date === "number") {
        validDate = new Date(date);
      }
      // If it's a string
      else if (typeof date === "string") {
        validDate = new Date(date);
      }
      // If it's an object with seconds and nanoseconds (Firestore timestamp object)
      else if (date && typeof date === "object" && "seconds" in date) {
        validDate = new Date(
          date.seconds * 1000 + (date.nanoseconds || 0) / 1000000,
        );
      } else {
        return "Date invalide";
      }

      // Check if the resulting date is valid
      if (isNaN(validDate.getTime())) {
        return "Date invalide";
      }

      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(validDate);
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return "Date invalide";
    }
  };

  const handleBanUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !banReason.trim()) return;

    try {
      await banUser(selectedUserId, banReason);
      toast.success("Utilisateur banni avec succès");
      setShowBanDialog(false);
      setBanReason("");
      setSelectedUserId("");
    } catch (error) {
      toast.error("Erreur lors du bannissement");
    }
  };

  const handleWarnUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !warnReason.trim()) return;

    try {
      await addWarning(selectedUserId, warnReason);
      toast.success("Avertissement envoyé avec succès");
      setShowWarnDialog(false);
      setWarnReason("");
      setSelectedUserId("");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'avertissement");
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      await updateUserRole(selectedUserId, selectedUserRole);
      toast.success(`Rôle mis à jour vers ${selectedUserRole}`);
      setShowRoleDialog(false);
      setSelectedUserId("");
      setSelectedUserRole("user");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du rôle");
    }
  };

  const handleUnbanUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      await unbanUser(selectedUserId);
      await logModerationAction("unban_user", selectedUserId, "user", "Utilisateur débanni par l'administration");
      toast.success("Utilisateur débanni avec succès");
      setShowUnbanDialog(false);
      setSelectedUserId("");
    } catch (error) {
      toast.error("Erreur lors du débannissement");
    }
  };

  // Moderation handlers
  const handleModerateDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moderationTarget || !moderationReason.trim()) return;

    try {
      if (moderationTarget.type === "product") {
        await moderateDeleteProduct(moderationTarget.id, moderationReason);
        toast.success("Produit supprimé avec succès");
      } else if (moderationTarget.type === "comment") {
        await moderateDeleteComment(moderationTarget.id, moderationReason);
        toast.success("Commentaire supprimé avec succès");
      }

      setShowModerationDialog(false);
      setModerationTarget(null);
      setModerationReason("");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Timer settings handlers
  const handleUpdateTimers = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTimerSettings(tempTimerSettings);
      toast.success("Paramètres de timer mis à jour");
      setShowTimerDialog(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des timers");
    }
  };

  // Product deletion handler
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast.success(`Produit "${productToDelete.title}" supprimé avec succès`);
      setShowDeleteDialog(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du produit");
    }
  };

  // License deletion handler
  const handleDeleteLicense = async () => {
    if (!licenseToDelete) return;

    try {
      await deleteLicense(licenseToDelete.id);
      toast.success(`License "${licenseToDelete.code}" supprimée avec succès`);
      setShowDeleteLicenseDialog(false);
      setLicenseToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de la license:", error);
      toast.error("Erreur lors de la suppression de la license");
    }
  };

  const activeLicenses = getActiveLicenses();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "compte":
        return <User className="w-4 h-4" />;
      case "carte-cadeau":
        return <CreditCard className="w-4 h-4" />;
      case "cheat":
        return <Zap className="w-4 h-4" />;
      default:
        return <Key className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "compte":
        return "Account";
      case "carte-cadeau":
        return "Gift Card";
      case "cheat":
        return "Cheat";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "compte":
        return "bg-blue-600";
      case "carte-cadeau":
        return "bg-purple-600";
      case "cheat":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "shop_access":
        return "Boutique";
      case "partner":
        return "Partenaire";
      case "user":
      default:
        return "Utilisateur";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-600 text-white";
      case "shop_access":
        return "bg-purple-600 text-white";
      case "partner":
        return "bg-yellow-600 text-white";
      case "user":
      default:
        return "bg-gray-600 text-gray-200";
    }
  };

  return (
    <div className="min-h-screen relative">
      <SimpleStarsBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <HeaderLogo />
              <div className="flex items-center space-x-4">
                {/* Moderation stats */}
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>
                    {getModerationStats().todayActions} actions aujourd'hui
                  </span>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-gray-900/50">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-red-600"
              >
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="moderation"
                className="data-[state=active]:bg-red-600"
              >
                <Shield className="w-4 h-4 mr-2" />
                Modération
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-red-600"
              >
                <User className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="timers"
                className="data-[state=active]:bg-red-600"
              >
                <Timer className="w-4 h-4 mr-2" />
                Timers
              </TabsTrigger>
              <TabsTrigger
                value="licenses"
                className="data-[state=active]:bg-red-600"
              >
                <Key className="w-4 h-4 mr-2" />
                Keys
              </TabsTrigger>
              <TabsTrigger
                value="maintenance"
                className="data-[state=active]:bg-red-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                Maintenance
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Products Management
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {products.length} product(s) total
                  </p>
                </div>
                <Dialog
                  open={showProductDialog}
                  onOpenChange={setShowProductDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        New Product
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Add a new product to your catalog
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-white">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={productForm.title}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                title: e.target.value,
                              })
                            }
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type" className="text-white">
                            Type
                          </Label>
                          <Select
                            value={productForm.type}
                            onValueChange={(value: "free" | "paid") =>
                              setProductForm({ ...productForm, type: value })
                            }
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="actionType" className="text-white">
                            Action principale
                          </Label>
                          <Select
                            value={productForm.actionType}
                            onValueChange={(value: "download" | "discord") =>
                              setProductForm({
                                ...productForm,
                                actionType: value,
                              })
                            }
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="download">
                                <div className="flex items-center space-x-2">
                                  <Download className="w-4 h-4" />
                                  <span>Téléchargement</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="discord">
                                <div className="flex items-center space-x-2">
                                  <LinkIcon className="w-4 h-4" />
                                  <span>Discord</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {productForm.type === "paid" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="price" className="text-white">
                              Prix (€)
                            </Label>
                            <Input
                              id="price"
                              type="number"
                              min="0"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  price: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lives" className="text-white">
                              Nombre de vies
                            </Label>
                            <Select
                              value={productForm.lives.toString()}
                              onValueChange={(value) =>
                                setProductForm({
                                  ...productForm,
                                  lives: parseInt(value),
                                })
                              }
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 vie</SelectItem>
                                <SelectItem value="3">3 vies</SelectItem>
                                <SelectItem value="5">5 vies</SelectItem>
                                <SelectItem value="10">10 vies</SelectItem>
                                <SelectItem value="25">25 vies</SelectItem>
                                <SelectItem value="50">50 vies</SelectItem>
                                <SelectItem value="100">100 vies</SelectItem>
                                <SelectItem value="999">
                                  Illimité (999)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              description: e.target.value,
                            })
                          }
                          className="bg-gray-800 border-gray-700 text-white"
                          rows={3}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl" className="text-white">
                          Image URL
                        </Label>
                        <Input
                          id="imageUrl"
                          value={productForm.imageUrl}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              imageUrl: e.target.value,
                            })
                          }
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discordUrl" className="text-white">
                          Discord Server URL (optionnel)
                        </Label>
                        <Input
                          id="discordUrl"
                          value={productForm.discordUrl}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              discordUrl: e.target.value,
                            })
                          }
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="https://discord.gg/example"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contentType" className="text-white">
                          Type de contenu
                        </Label>
                        <Select
                          value={productForm.contentType}
                          onValueChange={(value: "link" | "text") =>
                            setProductForm({
                              ...productForm,
                              contentType: value,
                            })
                          }
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">
                              <div className="flex items-center space-x-2">
                                <LinkIcon className="w-4 h-4" />
                                <span>Lien de téléchargement</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="text">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>Contenu texte (bloc-notes)</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Champs conditionnels selon l'action type */}
                      {productForm.actionType === "download" &&
                        (productForm.contentType === "link" ? (
                          <div className="space-y-2">
                            <Label htmlFor="downloadUrl" className="text-white">
                              Download URL
                            </Label>
                            <Input
                              id="downloadUrl"
                              value={productForm.downloadUrl}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  downloadUrl: e.target.value,
                                })
                              }
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="https://example.com/download"
                              required
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label htmlFor="content" className="text-white">
                              Contenu du bloc-notes
                            </Label>
                            <Textarea
                              id="content"
                              value={productForm.content}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  content: e.target.value,
                                })
                              }
                              className="bg-gray-800 border-gray-700 text-white"
                              rows={8}
                              placeholder="Entrez le contenu qui sera affiché dans le bloc-notes..."
                              required
                            />
                          </div>
                        ))}

                      {productForm.actionType === "discord" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="discordUrlRequired"
                            className="text-white"
                          >
                            Discord Server URL{" "}
                            <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="discordUrlRequired"
                            value={productForm.discordUrl}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                discordUrl: e.target.value,
                              })
                            }
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="https://discord.gg/example"
                            required
                          />
                        </div>
                      )}

                      {productForm.actionType === "download" && (
                        <div className="space-y-2">
                          <Label htmlFor="discordUrl" className="text-white">
                            Discord Server URL (optionnel)
                          </Label>
                          <Input
                            id="discordUrl"
                            value={productForm.discordUrl}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                discordUrl: e.target.value,
                              })
                            }
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="https://discord.gg/example"
                          />
                        </div>
                      )}
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowProductDialog(false)}
                          className="border-gray-700"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Add
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Dialog d'édition */}
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                  <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Modifier le produit
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Modifiez les informations de votre produit
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProduct} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title" className="text-white">
                            Title
                          </Label>
                          <Input
                            id="edit-title"
                            value={productForm.title}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                title: e.target.value,
                              })
                            }
                            className="bg-gray-800 border-gray-700 text-white"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-type" className="text-white">
                            Type
                          </Label>
                          <Select
                            value={productForm.type}
                            onValueChange={(value: "free" | "paid") =>
                              setProductForm({ ...productForm, type: value })
                            }
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-actionType"
                            className="text-white"
                          >
                            Action principale
                          </Label>
                          <Select
                            value={productForm.actionType}
                            onValueChange={(value: "download" | "discord") =>
                              setProductForm({
                                ...productForm,
                                actionType: value,
                              })
                            }
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="download">
                                <div className="flex items-center space-x-2">
                                  <Download className="w-4 h-4" />
                                  <span>Téléchargement</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="discord">
                                <div className="flex items-center space-x-2">
                                  <LinkIcon className="w-4 h-4" />
                                  <span>Discord</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {productForm.type === "paid" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-price" className="text-white">
                              Prix (€)
                            </Label>
                            <Input
                              id="edit-price"
                              type="number"
                              min="0"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  price: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="bg-gray-800 border-gray-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-lives" className="text-white">
                              Nombre de vies
                            </Label>
                            <Select
                              value={productForm.lives.toString()}
                              onValueChange={(value) =>
                                setProductForm({
                                  ...productForm,
                                  lives: parseInt(value),
                                })
                              }
                            >
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 vie</SelectItem>
                                <SelectItem value="3">3 vies</SelectItem>
                                <SelectItem value="5">5 vies</SelectItem>
                                <SelectItem value="10">10 vies</SelectItem>
                                <SelectItem value="25">25 vies</SelectItem>
                                <SelectItem value="50">50 vies</SelectItem>
                                <SelectItem value="100">100 vies</SelectItem>
                                <SelectItem value="999">
                                  Illimité (999)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label
                          htmlFor="edit-description"
                          className="text-white"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="edit-description"
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              description: e.target.value,
                            })
                          }
                          className="bg-gray-800 border-gray-700 text-white"
                          rows={3}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-imageUrl" className="text-white">
                          Image URL
                        </Label>
                        <Input
                          id="edit-imageUrl"
                          value={productForm.imageUrl}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              imageUrl: e.target.value,
                            })
                          }
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-discordUrl" className="text-white">
                          Discord Server URL (optionnel)
                        </Label>
                        <Input
                          id="edit-discordUrl"
                          value={productForm.discordUrl}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              discordUrl: e.target.value,
                            })
                          }
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="https://discord.gg/example"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="edit-contentType"
                          className="text-white"
                        >
                          Type de contenu
                        </Label>
                        <Select
                          value={productForm.contentType}
                          onValueChange={(value: "link" | "text") =>
                            setProductForm({
                              ...productForm,
                              contentType: value,
                            })
                          }
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="link">
                              <div className="flex items-center space-x-2">
                                <LinkIcon className="w-4 h-4" />
                                <span>Lien de téléchargement</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="text">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>Contenu texte (bloc-notes)</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Champs conditionnels selon l'action type */}
                      {productForm.actionType === "download" &&
                        (productForm.contentType === "link" ? (
                          <div className="space-y-2">
                            <Label
                              htmlFor="edit-downloadUrl"
                              className="text-white"
                            >
                              Download URL
                            </Label>
                            <Input
                              id="edit-downloadUrl"
                              value={productForm.downloadUrl}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  downloadUrl: e.target.value,
                                })
                              }
                              className="bg-gray-800 border-gray-700 text-white"
                              placeholder="https://example.com/download"
                              required
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label
                              htmlFor="edit-content"
                              className="text-white"
                            >
                              Contenu du bloc-notes
                            </Label>
                            <Textarea
                              id="edit-content"
                              value={productForm.content}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  content: e.target.value,
                                })
                              }
                              className="bg-gray-800 border-gray-700 text-white"
                              rows={8}
                              placeholder="Entrez le contenu qui sera affiché dans le bloc-notes..."
                              required
                            />
                          </div>
                        ))}

                      {productForm.actionType === "discord" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-discordUrlRequired"
                            className="text-white"
                          >
                            Discord Server URL{" "}
                            <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="edit-discordUrlRequired"
                            value={productForm.discordUrl}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                discordUrl: e.target.value,
                              })
                            }
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="https://discord.gg/example"
                            required
                          />
                        </div>
                      )}

                      {productForm.actionType === "download" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="edit-discordUrl"
                            className="text-white"
                          >
                            Discord Server URL (optionnel)
                          </Label>
                          <Input
                            id="edit-discordUrl"
                            value={productForm.discordUrl}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                discordUrl: e.target.value,
                              })
                            }
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="https://discord.gg/example"
                          />
                        </div>
                      )}
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowEditDialog(false);
                            setEditingProduct(null);
                            resetProductForm();
                          }}
                          className="border-gray-700"
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mettre à jour
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="border-gray-800 bg-gray-900/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {product.title}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {product.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge
                                variant={
                                  product.type === "free"
                                    ? "default"
                                    : "destructive"
                                }
                                className={
                                  product.type === "free"
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }
                              >
                                {product.type === "free" ? "Free" : "Paid"}
                              </Badge>
                              {product.type === "paid" && product.price && (
                                <Badge
                                  variant="outline"
                                  className="border-yellow-500 text-yellow-400"
                                >
                                  <Euro className="w-3 h-3 mr-1" />
                                  {product.price.toFixed(2)}
                                </Badge>
                              )}
                              {product.type === "paid" && product.lives && (
                                <Badge
                                  variant="outline"
                                  className="border-pink-500 text-pink-400"
                                >
                                  <Heart className="w-3 h-3 mr-1" />
                                  {product.lives} vies
                                </Badge>
                              )}
                              <Badge
                                variant="outline"
                                className={
                                  product.actionType === "discord"
                                    ? "border-purple-500 text-purple-400"
                                    : "border-blue-500 text-blue-400"
                                }
                              >
                                {product.actionType === "discord" ? (
                                  <>
                                    <LinkIcon className="w-3 h-3 mr-1" />
                                    Action: Discord
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-3 h-3 mr-1" />
                                    Action: Download
                                  </>
                                )}
                              </Badge>
                              {product.discordUrl &&
                                product.actionType === "download" && (
                                  <Badge
                                    variant="outline"
                                    className="border-blue-500 text-blue-400"
                                  >
                                    <LinkIcon className="w-3 h-3 mr-1" />+
                                    Discord
                                  </Badge>
                                )}
                              <span className="text-gray-500 text-xs">
                                {formatDate(product.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="border-blue-700 text-blue-400 hover:bg-blue-500/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {product.actionType === "download" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (product.contentType === "link") {
                                  window.open(product.downloadUrl, "_blank");
                                } else {
                                  // Afficher le contenu dans une nouvelle fenêtre
                                  const newWindow = window.open("", "_blank");
                                  if (newWindow) {
                                    newWindow.document.write(
                                      `<pre>${product.content || "Aucun contenu"}</pre>`,
                                    );
                                  }
                                }
                              }}
                              className="border-gray-700"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          {product.discordUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(product.discordUrl, "_blank")
                              }
                              className="border-purple-700 text-purple-400 hover:bg-purple-500/10"
                            >
                              <LinkIcon className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setProductToDelete({id: product.id, title: product.title});
                              setShowDeleteDialog(true);
                            }}
                            className="border-red-700 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Product Delete Confirmation Dialog */}
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Supprimer le produit
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Cette action est irréversible. Le produit sera définitivement supprimé.
                    </DialogDescription>
                  </DialogHeader>
                  {productToDelete && (
                    <div className="bg-red-900/50 border border-red-700 rounded p-3">
                      <p className="text-red-200 text-sm">
                        <strong>Produit à supprimer :</strong> {productToDelete.title}
                      </p>
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowDeleteDialog(false);
                        setProductToDelete(null);
                      }}
                      className="border-gray-700"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDeleteProduct}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Supprimer définitivement
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Moderation Tab */}
            <TabsContent value="moderation" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Modération & Contrôle
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {getModerationStats().totalActions} action(s) au total •{" "}
                    {getModerationStats().todayActions} aujourd'hui
                  </p>
                </div>
              </div>

              {/* Moderation Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {getModerationStats().deletedProducts}
                    </div>
                    <div className="text-sm text-gray-400">
                      Produits supprimés
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {getModerationStats().deletedComments}
                    </div>
                    <div className="text-sm text-gray-400">
                      Commentaires supprimés
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {getModerationStats().bannedUsers}
                    </div>
                    <div className="text-sm text-gray-400">
                      Utilisateurs bannis
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {getModerationStats().unbannedUsers}
                    </div>
                    <div className="text-sm text-gray-400">
                      Utilisateurs débannis
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {getModerationStats().warnedUsers}
                    </div>
                    <div className="text-sm text-gray-400">Avertissements</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Moderation Actions */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Actions récentes</CardTitle>
                  <CardDescription className="text-gray-400">
                    Historique des actions de modération
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {moderationActions.slice(0, 10).map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              action.type === "delete_product"
                                ? "bg-red-600"
                                : action.type === "delete_comment"
                                  ? "bg-orange-600"
                                  : action.type === "ban_user"
                                    ? "bg-purple-600"
                                    : action.type === "unban_user"
                                      ? "bg-green-600"
                                      : "bg-yellow-600"
                            }`}
                          >
                            {action.type === "delete_product" && (
                              <Package className="w-4 h-4 text-white" />
                            )}
                            {action.type === "delete_comment" && (
                              <MessageSquare className="w-4 h-4 text-white" />
                            )}
                            {action.type === "ban_user" && (
                              <User className="w-4 h-4 text-white" />
                            )}
                            {action.type === "unban_user" && (
                              <UserCheck className="w-4 h-4 text-white" />
                            )}
                            {action.type === "warn_user" && (
                              <AlertTriangle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {action.type === "delete_product" &&
                                "Produit supprimé"}
                              {action.type === "delete_comment" &&
                                "Commentaire supprimé"}
                              {action.type === "ban_user" &&
                                "Utilisateur banni"}
                              {action.type === "unban_user" &&
                                "Utilisateur débanni"}
                              {action.type === "warn_user" &&
                                "Avertissement envoyé"}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Par {action.moderatorUsername} •{" "}
                              {formatDate(action.createdAt)}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Raison: {action.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {moderationActions.length === 0 && (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">
                          Aucune action de modération récente
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Actions rapides</CardTitle>
                  <CardDescription className="text-gray-400">
                    Suppression rapide de contenu inapproprié
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Recent Products for Quick Moderation */}
                    <div>
                      <h4 className="text-white font-medium mb-3">
                        Produits récents
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {products.slice(0, 5).map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-2 bg-gray-800/30 rounded"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {product.title}
                              </p>
                              <p className="text-gray-400 text-xs">
                                Par {product.createdByUsername || "Inconnu"} •{" "}
                                {formatDate(product.createdAt)}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setModerationTarget({
                                  id: product.id,
                                  type: "product",
                                  title: product.title,
                                });
                                setShowModerationDialog(true);
                              }}
                              className="border-red-700 text-red-400 hover:bg-red-500/10 ml-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Comments for Quick Moderation */}
                    <div>
                      <h4 className="text-white font-medium mb-3">
                        Commentaires récents
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {allComments?.slice(0, 5).map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-center justify-between p-2 bg-gray-800/30 rounded"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">
                                {comment.content}
                              </p>
                              <p className="text-gray-400 text-xs">
                                Par {comment.username} •{" "}
                                {formatDate(comment.createdAt)}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setModerationTarget({
                                  id: comment.id,
                                  type: "comment",
                                  title: comment.content.slice(0, 50) + "...",
                                });
                                setShowModerationDialog(true);
                              }}
                              className="border-red-700 text-red-400 hover:bg-red-500/10 ml-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        {(!allComments || allComments.length === 0) && (
                          <div className="text-center py-4">
                            <p className="text-gray-400 text-sm">
                              Aucun commentaire récent
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Moderation Dialog */}
              <Dialog
                open={showModerationDialog}
                onOpenChange={setShowModerationDialog}
              >
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Supprimer{" "}
                      {moderationTarget?.type === "product"
                        ? "le produit"
                        : "le commentaire"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      "{moderationTarget?.title}"
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleModerateDelete} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="moderationReason" className="text-white">
                        Raison de la suppression
                      </Label>
                      <Textarea
                        id="moderationReason"
                        value={moderationReason}
                        onChange={(e) => setModerationReason(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Expliquez pourquoi ce contenu est supprimé..."
                        required
                        rows={3}
                      />
                    </div>
                    <div className="bg-red-900/50 border border-red-700 rounded p-3">
                      <p className="text-red-200 text-sm">
                        <strong>Attention:</strong> Cette action est
                        irréversible et sera enregistrée dans l'historique de
                        modération.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowModerationDialog(false);
                          setModerationTarget(null);
                          setModerationReason("");
                        }}
                        className="border-gray-700"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700"
                        disabled={!moderationReason.trim()}
                      >
                        Supprimer définitivement
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Users Management
                </h2>
                <p className="text-gray-400 text-sm">
                  {users?.length || 0} user(s) total •{" "}
                  {users?.filter((u) => u.isOnline).length || 0} online
                </p>
              </div>

              <div className="grid gap-4">
                {users?.map((user) => (
                  <Card
                    key={user.id}
                    className="border-gray-800 bg-gray-900/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-base font-medium text-white">
                                {user.username}
                              </h3>
                              <Badge
                                variant="outline"
                                className={getRoleColor(user.role)}
                              >
                                {getRoleLabel(user.role)}
                              </Badge>
                              <Badge
                                variant={
                                  user.isOnline ? "default" : "secondary"
                                }
                                className={
                                  user.isOnline
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-600 text-gray-200"
                                }
                              >
                                {user.isOnline ? "En ligne" : "Hors ligne"}
                              </Badge>
                              {user.isBanned && (
                                <Badge
                                  variant="destructive"
                                  className="bg-red-600 text-white"
                                >
                                  Banni
                                </Badge>
                              )}
                              {user.warnings && user.warnings.length > 0 && (
                                <Badge
                                  variant="outline"
                                  className="border-orange-500 text-orange-400"
                                >
                                  {user.warnings.length} warn(s)
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                              <span>Créé: {formatDate(user.createdAt)}</span>
                              <span>
                                Dernière connexion: {formatDate(user.lastSeen)}
                              </span>
                            </div>
                            {user.isBanned && user.banReason && (
                              <div className="mt-2 p-2 bg-red-900/50 rounded border border-red-700">
                                <p className="text-red-200 text-xs">
                                  <strong>Raison:</strong> {user.banReason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setSelectedUserRole(user.role);
                              setShowRoleDialog(true);
                            }}
                            className="border-purple-700 text-purple-400 hover:bg-purple-500/10"
                          >
                            Rôle
                          </Button>
                          {!user.isBanned && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUserId(user.id);
                                  setShowWarnDialog(true);
                                }}
                                className="border-orange-700 text-orange-400 hover:bg-orange-500/10"
                              >
                                Warn
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUserId(user.id);
                                  setShowBanDialog(true);
                                }}
                                className="border-red-700 text-red-400 hover:bg-red-500/10"
                              >
                                Ban
                              </Button>
                            </>
                          )}
                          {user.isBanned && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setShowUnbanDialog(true);
                              }}
                              className="border-green-700 text-green-400 hover:bg-green-500/10"
                            >
                              Unban
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(!users || users.length === 0) && (
                  <Card className="border-gray-800 bg-gray-900/50">
                    <CardContent className="p-12 text-center">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Aucun utilisateur
                      </h3>
                      <p className="text-gray-400">
                        Les utilisateurs apparaîtront ici une fois connectés
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Ban Dialog */}
              <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Bannir l'utilisateur
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Cette action est définitive et irréversible.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBanUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="banReason" className="text-white">
                        Raison du bannissement
                      </Label>
                      <Textarea
                        id="banReason"
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Spécifiez la raison du bannissement..."
                        required
                        rows={3}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowBanDialog(false);
                          setBanReason("");
                          setSelectedUserId("");
                        }}
                        className="border-gray-700"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700"
                        disabled={!banReason.trim()}
                      >
                        Bannir définitivement
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Role Dialog */}
              <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Modifier le rôle utilisateur
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Choisissez le nouveau rôle pour cet utilisateur.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpdateRole} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="userRole" className="text-white">
                        Rôle
                      </Label>
                      <Select
                        value={selectedUserRole}
                        onValueChange={(
                          value: "user" | "shop_access" | "partner" | "admin",
                        ) => setSelectedUserRole(value)}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>Utilisateur</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="shop_access">
                            <div className="flex items-center space-x-2">
                              <Store className="w-4 h-4" />
                              <span>Accès Boutique</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="partner">
                            <div className="flex items-center space-x-2">
                              <Crown className="w-4 h-4" />
                              <span>Partenaire</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4" />
                              <span>Administrateur</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-blue-900/50 border border-blue-700 rounded p-3">
                      <p className="text-blue-200 text-sm">
                        <strong>Permissions :</strong>
                        {selectedUserRole === "user" &&
                          " Accès utilisateur standard"}
                        {selectedUserRole === "shop_access" &&
                          " Peut uploader et gérer ses propres produits (avec cooldown)"}
                        {selectedUserRole === "partner" &&
                          " Partenaire officiel - Peut uploader sans restrictions et titre custom"}
                        {selectedUserRole === "admin" &&
                          " Accès total à l'administration"}
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowRoleDialog(false);
                          setSelectedUserId("");
                          setSelectedUserRole("user");
                        }}
                        className="border-gray-700"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Mettre à jour le rôle
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Warning Dialog */}
              <Dialog open={showWarnDialog} onOpenChange={setShowWarnDialog}>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Avertir l'utilisateur
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      L'utilisateur recevra cet avertissement immédiatement.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleWarnUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="warnReason" className="text-white">
                        Raison de l'avertissement
                      </Label>
                      <Textarea
                        id="warnReason"
                        value={warnReason}
                        onChange={(e) => setWarnReason(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Spécifiez la raison de l'avertissement..."
                        required
                        rows={3}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowWarnDialog(false);
                          setWarnReason("");
                          setSelectedUserId("");
                        }}
                        className="border-gray-700"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={!warnReason.trim()}
                      >
                        Envoyer l'avertissement
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Unban Dialog */}
              <Dialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Débannir l'utilisateur
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      L'utilisateur pourra de nouveau accéder au site.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUnbanUser} className="space-y-4">
                    <div className="bg-green-900/50 border border-green-700 rounded p-3">
                      <p className="text-green-200 text-sm">
                        <strong>Confirmation:</strong> Cette action débannira définitivement l'utilisateur.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowUnbanDialog(false);
                          setSelectedUserId("");
                        }}
                        className="border-gray-700"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Débannir l'utilisateur
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Timers Tab */}
            <TabsContent value="timers" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Gestion des Timers
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Configurez les cooldowns pour les actions utilisateur
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setTempTimerSettings(timerSettings);
                    setShowTimerDialog(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier les timers
                </Button>
              </div>

              {/* Current Timer Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Store className="w-5 h-5 mr-2 text-blue-400" />
                      Cooldown Produits Boutique
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Temps d'attente entre créations de produits pour les
                      utilisateurs "Boutique"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {timerSettings.shopProductCooldown}
                      </div>
                      <div className="text-sm text-gray-400">minutes</div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded">
                      <p className="text-blue-200 text-xs">
                        Les utilisateurs avec le rôle "Boutique" doivent
                        attendre ce délai entre chaque création de produit. Les
                        "Partners" et "Admins" ne sont pas affectés.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-orange-400" />
                      Cooldown Commentaires
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Temps d'attente entre commentaires pour tous les
                      utilisateurs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400">
                        {timerSettings.commentCooldown}
                      </div>
                      <div className="text-sm text-gray-400">minutes</div>
                    </div>
                    <div className="mt-4 p-3 bg-orange-900/20 border border-orange-700/30 rounded">
                      <p className="text-orange-200 text-xs">
                        Tous les utilisateurs doivent attendre ce délai entre
                        chaque commentaire. Aide à prévenir le spam de
                        commentaires.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Live Timer Status */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-400" />
                    Statut des timers en temps réel
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Aperçu des utilisateurs actuellement en cooldown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users
                      ?.filter((user) => user.role === "shop_access")
                      .map((user) => {
                        const userProducts = products.filter(
                          (p) => p.createdBy === user.id,
                        );
                        const lastProduct = userProducts.sort(
                          (a, b) =>
                            b.createdAt.getTime() - a.createdAt.getTime(),
                        )[0];
                        const canCreate =
                          !lastProduct ||
                          (new Date().getTime() -
                            lastProduct.createdAt.getTime()) /
                            (1000 * 60) >=
                            timerSettings.shopProductCooldown;
                        const remaining = lastProduct
                          ? Math.max(
                              0,
                              timerSettings.shopProductCooldown -
                                (new Date().getTime() -
                                  lastProduct.createdAt.getTime()) /
                                  (1000 * 60),
                            )
                          : 0;

                        return (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 bg-gray-800/30 rounded"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {user.username}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {userProducts.length} produit(s) créé(s)
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {canCreate ? (
                                <Badge className="bg-green-600 text-white">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Disponible
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="border-orange-500 text-orange-400"
                                >
                                  <Clock className="w-3 h-3 mr-1" />
                                  {Math.ceil(remaining)} min
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    {!users?.filter((user) => user.role === "shop_access")
                      .length && (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">
                          Aucun utilisateur "Boutique" trouvé
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timer Settings Dialog */}
              <Dialog open={showTimerDialog} onOpenChange={setShowTimerDialog}>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Modifier les paramètres de timer
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Ajustez les cooldowns pour contrôler la fréquence des
                      actions
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpdateTimers} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shopCooldown" className="text-white">
                        Cooldown produits boutique (minutes)
                      </Label>
                      <Input
                        id="shopCooldown"
                        type="number"
                        min="1"
                        max="1440"
                        value={tempTimerSettings.shopProductCooldown}
                        onChange={(e) =>
                          setTempTimerSettings({
                            ...tempTimerSettings,
                            shopProductCooldown: parseInt(e.target.value) || 1,
                          })
                        }
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <p className="text-gray-400 text-xs">
                        Entre 1 minute et 24 heures (1440 minutes)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="commentCooldown" className="text-white">
                        Cooldown commentaires (minutes)
                      </Label>
                      <Input
                        id="commentCooldown"
                        type="number"
                        min="1"
                        max="60"
                        value={tempTimerSettings.commentCooldown}
                        onChange={(e) =>
                          setTempTimerSettings({
                            ...tempTimerSettings,
                            commentCooldown: parseInt(e.target.value) || 1,
                          })
                        }
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <p className="text-gray-400 text-xs">
                        Entre 1 minute et 1 heure (60 minutes)
                      </p>
                    </div>

                    <div className="bg-yellow-900/50 border border-yellow-700 rounded p-3">
                      <p className="text-yellow-200 text-sm">
                        <strong>Important:</strong> Les modifications prendront
                        effet immédiatement. Les timers en cours ne seront pas
                        affectés.
                      </p>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowTimerDialog(false);
                          setTempTimerSettings(timerSettings);
                        }}
                        className="border-gray-700"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Appliquer les modifications
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Licenses Tab */}
            <TabsContent value="licenses" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Keys Management
                  </h2>
                  <p className="text-gray-400">
                    {activeLicenses.length} active key(s) out of{" "}
                    {licenses.length} total
                  </p>
                </div>
                <Dialog
                  open={showLicenseDialog}
                  onOpenChange={setShowLicenseDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        New Access Key
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Create a key with limited number of uses
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateLicense} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="productSelect" className="text-white">
                            Product
                          </Label>
                          <Select
                            value={licenseForm.productId}
                            onValueChange={(value) =>
                              setLicenseForm({
                                ...licenseForm,
                                productId: value,
                              })
                            }
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products
                                .filter((p) => p.type === "paid")
                                .map((product) => (
                                  <SelectItem
                                    key={product.id}
                                    value={product.id}
                                  >
                                    {product.title}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-white">
                            Category
                          </Label>
                          <Select
                            value={licenseForm.category}
                            onValueChange={(
                              value: "compte" | "carte-cadeau" | "cheat",
                            ) =>
                              setLicenseForm({
                                ...licenseForm,
                                category: value,
                              })
                            }
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compte">
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4" />
                                  <span>Account</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="carte-cadeau">
                                <div className="flex items-center space-x-2">
                                  <CreditCard className="w-4 h-4" />
                                  <span>Gift Card</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="cheat">
                                <div className="flex items-center space-x-2">
                                  <Zap className="w-4 h-4" />
                                  <span>Cheat</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxUsages" className="text-white">
                          Number of allowed uses
                        </Label>
                        <Select
                          value={licenseForm.maxUsages.toString()}
                          onValueChange={(value) =>
                            setLicenseForm({
                              ...licenseForm,
                              maxUsages: parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 use</SelectItem>
                            <SelectItem value="3">3 uses</SelectItem>
                            <SelectItem value="5">5 uses</SelectItem>
                            <SelectItem value="10">10 uses</SelectItem>
                            <SelectItem value="25">25 uses</SelectItem>
                            <SelectItem value="50">50 uses</SelectItem>
                            <SelectItem value="100">100 uses</SelectItem>
                            <SelectItem value="999">Unlimited (999)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowLicenseDialog(false)}
                          className="border-gray-700"
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700"
                          disabled={!licenseForm.productId}
                        >
                          Create
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {licenses.map((license) => {
                  const product = products.find(
                    (p) => p.id === license.productId,
                  );
                  const isActive =
                    license.isActive &&
                    license.currentUsages < license.maxUsages;
                  const usagePercentage =
                    (license.currentUsages / license.maxUsages) * 100;

                  return (
                    <Card
                      key={license.id}
                      className="border-gray-800 bg-gray-900/50"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-white">
                                {product?.title || "Produit supprimé"}
                              </h3>
                              <Badge
                                className={`${getCategoryColor(license.category)} text-white`}
                              >
                                <span className="mr-1">
                                  {getCategoryIcon(license.category)}
                                </span>
                                {getCategoryLabel(license.category)}
                              </Badge>
                              <Badge
                                variant={isActive ? "default" : "destructive"}
                                className={
                                  isActive ? "bg-green-600" : "bg-gray-600"
                                }
                              >
                                {isActive ? "Active" : "Depleted"}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="font-mono bg-gray-800 px-3 py-1 rounded text-white">
                                  {license.code}
                                </span>
                                <span className="text-gray-400">
                                  Created on {formatDate(license.createdAt)}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-400">Usage:</span>
                                  <span className="text-white font-mono">
                                    {license.currentUsages} /{" "}
                                    {license.maxUsages}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      usagePercentage >= 100
                                        ? "bg-red-600"
                                        : usagePercentage >= 80
                                          ? "bg-orange-500"
                                          : "bg-green-600"
                                    }`}
                                    style={{
                                      width: `${Math.min(usagePercentage, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyLicenseCode(license.code)}
                              className="border-gray-700 hover:bg-gray-800"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setLicenseToDelete({id: license.id, code: license.code});
                                setShowDeleteLicenseDialog(true);
                              }}
                              className="border-red-700 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance" className="space-y-6">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Maintenance Mode</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enable maintenance mode to block site access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="maintenance-toggle"
                        className="text-white text-base"
                      >
                        Maintenance mode
                      </Label>
                      <p className="text-gray-400 text-sm">
                        {maintenanceForm.isActive
                          ? "Site is currently under maintenance"
                          : "Site is accessible to visitors"}
                      </p>
                    </div>
                    <Switch
                      id="maintenance-toggle"
                      checked={maintenanceForm.isActive}
                      onCheckedChange={(checked) =>
                        setMaintenanceForm({
                          ...maintenanceForm,
                          isActive: checked,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maintenance-message" className="text-white">
                      Maintenance message
                    </Label>
                    <Textarea
                      id="maintenance-message"
                      value={maintenanceForm.message}
                      onChange={(e) =>
                        setMaintenanceForm({
                          ...maintenanceForm,
                          message: e.target.value,
                        })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={3}
                      placeholder="Update in progress, come back later ���️"
                    />
                  </div>

                  <Button
                    onClick={handleMaintenanceToggle}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Apply Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
