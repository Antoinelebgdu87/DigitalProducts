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
} from "lucide-react";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { toast } from "sonner";
import { Product } from "@/types";

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { isMaintenanceMode, maintenanceMessage, setMaintenanceMode } =
    useMaintenance();
  const {
    products,
    addProduct,
    deleteProduct,
    loading: productsLoading,
  } = useProducts();
  const {
    licenses,
    createLicense,
    deleteLicense,
    getActiveLicenses,
    loading: licensesLoading,
  } = useLicenses();

  // Product form state
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    downloadUrl: "",
    type: "free" as "free" | "paid",
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

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(productForm);
      toast.success("Produit ajouté avec succès !");
      setProductForm({
        title: "",
        description: "",
        imageUrl: "",
        downloadUrl: "",
        type: "free",
      });
      setShowProductDialog(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du produit");
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
      toast.success("Clé créée avec succès !");

      // Copy to clipboard
      navigator.clipboard.writeText(code);
      toast.info("Code de clé copié dans le presse-papiers");

      setLicenseForm({ productId: "", category: "compte", maxUsages: 1 });
      setShowLicenseDialog(false);
    } catch (error) {
      toast.error("Erreur lors de la création de la clé");
    }
  };

  const handleMaintenanceToggle = async () => {
    try {
      await setMaintenanceMode(
        maintenanceForm.isActive,
        maintenanceForm.message,
      );
      toast.success(
        `Mode maintenance ${maintenanceForm.isActive ? "activé" : "désactivé"}`,
      );
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du mode maintenance");
    }
  };

  const copyLicenseCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copié dans le presse-papiers");
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
        return "Compte";
      case "carte-cadeau":
        return "Carte Cadeau";
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
      <BackgroundAnimation />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="w-8 h-8 text-red-500" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                  <p className="text-gray-400 text-sm">
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
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-red-600"
              >
                <Package className="w-4 h-4 mr-2" />
                Products
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
                  <h2 className="text-2xl font-bold text-white">
                    Products Management
                  </h2>
                  <p className="text-gray-400">
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
                        Nouveau Produit
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Ajoutez un nouveau produit à votre catalogue
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-white">
                            Titre
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
                              <SelectItem value="free">Gratuit</SelectItem>
                              <SelectItem value="paid">Payant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
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
                          URL de l'image
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
                        <Label htmlFor="downloadUrl" className="text-white">
                          URL de téléchargement
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
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowProductDialog(false)}
                          className="border-gray-700"
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Ajouter
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
                                {product.type === "free" ? "Gratuit" : "Payant"}
                              </Badge>
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
                            onClick={() =>
                              window.open(product.downloadUrl, "_blank")
                            }
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

            {/* Licenses Tab */}
            <TabsContent value="licenses" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Gestion des Licences
                  </h2>
                  <p className="text-gray-400">
                    {activeLicenses.length} licence(s) active(s) sur{" "}
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
                      Créer une clé
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Nouvelle Clé d'Accès
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Créez une clé avec un nombre d'utilisations limité
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateLicense} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="productSelect" className="text-white">
                            Produit
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
                              <SelectValue placeholder="Sélectionner un produit" />
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
                            Catégorie
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
                                  <span>Compte</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="carte-cadeau">
                                <div className="flex items-center space-x-2">
                                  <CreditCard className="w-4 h-4" />
                                  <span>Carte Cadeau</span>
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
                          Nombre d'utilisations autorisées
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
                            <SelectItem value="1">1 utilisation</SelectItem>
                            <SelectItem value="3">3 utilisations</SelectItem>
                            <SelectItem value="5">5 utilisations</SelectItem>
                            <SelectItem value="10">10 utilisations</SelectItem>
                            <SelectItem value="25">25 utilisations</SelectItem>
                            <SelectItem value="50">50 utilisations</SelectItem>
                            <SelectItem value="100">
                              100 utilisations
                            </SelectItem>
                            <SelectItem value="999">Illimité (999)</SelectItem>
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
                          Créer
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
                                {isActive ? "Active" : "Épuisée"}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="font-mono bg-gray-800 px-3 py-1 rounded text-white">
                                  {license.code}
                                </span>
                                <span className="text-gray-400">
                                  Créée le {formatDate(license.createdAt)}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-400">
                                    Utilisations :
                                  </span>
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
                  <CardTitle className="text-white">Mode Maintenance</CardTitle>
                  <CardDescription className="text-gray-400">
                    Activez le mode maintenance pour bloquer l'accès au site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="maintenance-toggle"
                        className="text-white text-base"
                      >
                        Mode maintenance
                      </Label>
                      <p className="text-gray-400 text-sm">
                        {maintenanceForm.isActive
                          ? "Le site est actuellement en maintenance"
                          : "Le site est accessible aux visiteurs"}
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
                      Message de maintenance
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
                      placeholder="Update en cours, revenez plus tard 🛠️"
                    />
                  </div>

                  <Button
                    onClick={handleMaintenanceToggle}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Appliquer les modifications
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
