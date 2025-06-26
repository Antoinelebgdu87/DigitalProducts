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
    duration: "24", // hours
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
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + parseInt(licenseForm.duration));

      const code = await createLicense(licenseForm.productId, expiresAt);
      toast.success("Licence créée avec succès !");

      // Copy to clipboard
      navigator.clipboard.writeText(code);
      toast.info("Code de licence copié dans le presse-papiers");

      setLicenseForm({ productId: "", duration: "24" });
      setShowLicenseDialog(false);
    } catch (error) {
      toast.error("Erreur lors de la création de la licence");
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
                  <h1 className="text-2xl font-bold text-white">
                    Panneau d'administration
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Gestion des produits et licences
                  </p>
                </div>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
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
                Produits
              </TabsTrigger>
              <TabsTrigger
                value="licenses"
                className="data-[state=active]:bg-red-600"
              >
                <Key className="w-4 h-4 mr-2" />
                Licences
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
                    Gestion des Produits
                  </h2>
                  <p className="text-gray-400">
                    {products.length} produit(s) total
                  </p>
                </div>
                <Dialog
                  open={showProductDialog}
                  onOpenChange={setShowProductDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un produit
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
                      Créer une licence
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Nouvelle Licence
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Créez une licence temporaire pour un produit payant
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateLicense} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="productSelect" className="text-white">
                          Produit
                        </Label>
                        <Select
                          value={licenseForm.productId}
                          onValueChange={(value) =>
                            setLicenseForm({ ...licenseForm, productId: value })
                          }
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Sélectionner un produit" />
                          </SelectTrigger>
                          <SelectContent>
                            {products
                              .filter((p) => p.type === "paid")
                              .map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-white">
                          Durée de validité (heures)
                        </Label>
                        <Select
                          value={licenseForm.duration}
                          onValueChange={(value) =>
                            setLicenseForm({ ...licenseForm, duration: value })
                          }
                        >
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 heure</SelectItem>
                            <SelectItem value="6">6 heures</SelectItem>
                            <SelectItem value="24">24 heures</SelectItem>
                            <SelectItem value="72">3 jours</SelectItem>
                            <SelectItem value="168">7 jours</SelectItem>
                            <SelectItem value="720">30 jours</SelectItem>
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
                  const isExpired = new Date() > license.expiresAt;
                  const isActive = !isExpired && !license.isUsed;

                  return (
                    <Card
                      key={license.id}
                      className="border-gray-800 bg-gray-900/50"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-white">
                                {product?.title || "Produit supprimé"}
                              </h3>
                              <Badge
                                variant={isActive ? "default" : "destructive"}
                                className={
                                  isActive ? "bg-green-600" : "bg-red-600"
                                }
                              >
                                {isActive ? "Active" : "Expirée"}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="font-mono bg-gray-800 px-2 py-1 rounded">
                                {license.code}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Expire le {formatDate(license.expiresAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyLicenseCode(license.code)}
                              className="border-gray-700"
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
