import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMaintenance } from "@/context/MaintenanceContext";
import { useProducts } from "@/hooks/useProducts";
import { useLicenses } from "@/hooks/useLicenses";
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
  CreditCard,
  Zap,
  Euro,
  Heart,
  Edit,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import StarfieldBackground from "@/components/StarfieldBackground";
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
  const { users, banUser, addWarning } = useUser();

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
    contentType: "link" as "link" | "text",
    content: "",
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
  const [showWarnDialog, setShowWarnDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [banReason, setBanReason] = useState("");
  const [warnReason, setWarnReason] = useState("");

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
      contentType: "link", // Par défaut lien pour compatibilité
      content: "",
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
      contentType: product.contentType || "link", // Par défaut lien pour compatibilité
      content: product.content || "",
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
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

  return (
    <div className="min-h-screen relative">
      <StarfieldBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="w-8 h-8 text-red-500" />
                <div>
                  <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
                  <p className="text-gray-400 text-xs">
                    Products and licenses management
                  </p>
                </div>
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
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-gray-900/50">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-red-600"
              >
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-red-600"
              >
                <User className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="prices"
                className="data-[state=active]:bg-red-600"
              >
                <Euro className="w-4 h-4 mr-2" />
                Prix
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
                      <div className="grid grid-cols-2 gap-4">
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
                      {productForm.contentType === "link" ? (
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
                      <div className="grid grid-cols-2 gap-4">
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
                      {productForm.contentType === "link" ? (
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
                          <Label htmlFor="edit-content" className="text-white">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProduct(product.id)}
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
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Users Management
                </h2>
                <p className="text-gray-400 text-sm">
                  {users?.length || 0} user(s) total • {users?.filter(u => u.isOnline).length || 0} online
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
                                variant={user.isOnline ? "default" : "secondary"}
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
                              <span>Dernière connexion: {formatDate(user.lastSeen)}</span>
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
            </TabsContent>

            {/* Prix Tab */}
            <TabsContent value="prices" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Gestion des Prix
                </h2>
                <p className="text-gray-400">
                  Modifiez les prix et paramètres de vos produits payants
                </p>
              </div>

              <div className="grid gap-4">
                {products
                  .filter((product) => product.type === "paid")
                  .map((product) => (
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
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge
                                  variant="outline"
                                  className="border-yellow-500 text-yellow-400"
                                >
                                  <Euro className="w-3 h-3 mr-1" />
                                  {product.price?.toFixed(2) || "0.00"}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-pink-500 text-pink-400"
                                >
                                  <Heart className="w-3 h-3 mr-1" />
                                  {product.lives || 1} vies
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    product.contentType === "link"
                                      ? "border-blue-500 text-blue-400"
                                      : "border-green-500 text-green-400"
                                  }
                                >
                                  {product.contentType === "link" ? (
                                    <LinkIcon className="w-3 h-3 mr-1" />
                                  ) : (
                                    <FileText className="w-3 h-3 mr-1" />
                                  )}
                                  {product.contentType === "link"
                                    ? "Lien"
                                    : "Bloc-notes"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="border-blue-700 text-blue-400 hover:bg-blue-500/10"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {products.filter((product) => product.type === "paid")
                  .length === 0 && (
                  <Card className="border-gray-800 bg-gray-900/50">
                    <CardContent className="p-12 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Aucun produit payant
                      </h3>
                      <p className="text-gray-400">
                        Créez des produits payants pour les gérer ici
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
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
                              onClick={() => deleteLicense(license.id)}
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
                      placeholder="Update in progress, come back later 🛠️"
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
