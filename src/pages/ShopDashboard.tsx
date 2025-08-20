import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { useUser } from "@/context/UserContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Package,
  Edit,
  Trash2,
  Download,
  Euro,
  Heart,
  FileText,
  Link as LinkIcon,
  Store,
  BarChart3,
  Crown,
  Shield,
} from "lucide-react";
import SimpleStarsBackground from "@/components/SimpleStarsBackground";
import { toast } from "sonner";
import { Product } from "@/types";
import { Link, Navigate } from "react-router-dom";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import LanguageSelector from "@/components/LanguageSelector";

const ShopDashboard: React.FC = () => {
  // Activer la traduction automatique
  useAutoTranslate();

  const { currentUser } = useUser();
  const {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    loading: productsLoading,
  } = useProducts();

  // Redirect if user doesn't have shop access
  if (
    !currentUser ||
    (currentUser.role !== "shop_access" &&
      currentUser.role !== "admin" &&
      currentUser.role !== "partner")
  ) {
    return <Navigate to="/" replace />;
  }

  // Filter products by current user - chaque rôle voit seulement ses propres produits
  const userProducts = products.filter(
    (product) => product.createdBy === currentUser.id,
  );

  // Debug logging
  React.useEffect(() => {
    console.log("🏪 Shop Debug:", {
      currentUserId: currentUser.id,
      totalProducts: products.length,
      userProducts: userProducts.length,
      products: products.map((p) => ({
        id: p.id,
        title: p.title,
        createdBy: p.createdBy,
        createdByUsername: p.createdByUsername,
      })),
    });
  }, [products, currentUser, userProducts]);

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

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add createdBy fields for shop users
      const productData = {
        ...productForm,
        createdBy: currentUser.id,
        createdByUsername: currentUser.username,
      };
      await addProduct(productData);
      toast.success("Produit ajouté avec succès!");
      resetProductForm();
      setShowProductDialog(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du produit");
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
      contentType: "link",
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
      contentType: product.contentType || "link",
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
      toast.success("Produit mis à jour avec succès!");
      resetProductForm();
      setShowEditDialog(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du produit");
    }
  };

  const formatDate = (date: any) => {
    try {
      let validDate: Date;

      if (!date) return "Date inconnue";
      if (date instanceof Date) {
        validDate = date;
      } else if (date && typeof date.toDate === "function") {
        validDate = date.toDate();
      } else if (typeof date === "number") {
        validDate = new Date(date);
      } else if (typeof date === "string") {
        validDate = new Date(date);
      } else if (date && typeof date === "object" && "seconds" in date) {
        validDate = new Date(
          date.seconds * 1000 + (date.nanoseconds || 0) / 1000000,
        );
      } else {
        return "Date invalide";
      }

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

  return (
    <div className="min-h-screen relative">
      <SimpleStarsBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                  <Store className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>Ma Boutique</span>
                    {currentUser.role === "partner" && (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    )}
                  </h1>
                  <p className="text-sm text-gray-400">
                    Gérez vos produits et suivez vos ventes •{" "}
                    {currentUser.username}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {/* Sélecteur de langue */}
                <LanguageSelector />

                {/* Badge de rôle */}
                {currentUser.role === "shop_access" && (
                  <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                    <Store className="w-3 h-3 mr-1" />
                    Boutique
                  </Badge>
                )}
                {currentUser.role === "partner" && (
                  <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Partenaire
                  </Badge>
                )}
                {currentUser.role === "admin" && (
                  <Badge className="bg-red-600/20 text-red-400 border-red-500/30">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}

                <Badge
                  variant="outline"
                  className="border-purple-500/30 text-purple-400 bg-purple-500/10"
                >
                  {userProducts.length} produit
                  {userProducts.length !== 1 ? "s" : ""}
                </Badge>
                <Link to="/">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Section de bienvenue */}
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-purple-600/10 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                      <Store className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Bienvenue dans votre boutique !
                      </h2>
                      <p className="text-gray-300">
                        Créez et gérez vos produits numériques facilement
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {userProducts.length}
                      </div>
                      <div className="text-xs text-gray-400">Produits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {userProducts.filter((p) => p.type === "free").length}
                      </div>
                      <div className="text-xs text-gray-400">Gratuits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {userProducts.filter((p) => p.type === "paid").length}
                      </div>
                      <div className="text-xs text-gray-400">Payants</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-blue-600/30 data-[state=active]:text-purple-300 transition-all duration-200"
              >
                <Package className="w-4 h-4 mr-2" />
                Mes Produits
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/30 data-[state=active]:to-blue-600/30 data-[state=active]:text-purple-300 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Statistiques
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Gestion des Produits
                  </h2>
                  <p className="text-gray-400">
                    {userProducts.length} produit
                    {userProducts.length !== 1 ? "s" : ""} dans votre boutique
                  </p>
                </div>
                <Dialog
                  open={showProductDialog}
                  onOpenChange={setShowProductDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un Produit
                      <Heart className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Nouveau Produit
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Ajoutez un nouveau produit à votre boutique
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
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

                      {productForm.actionType === "download" && (
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
                      )}

                      {/* Champs conditionnels selon l'action type */}
                      {productForm.actionType === "download" &&
                        (productForm.contentType === "link" ? (
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
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Ajouter
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {userProducts.length > 0 ? (
                  userProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="border-gray-800/50 bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center overflow-hidden border border-gray-700/50">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                {product.title}
                              </h3>
                              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex items-center space-x-2 flex-wrap gap-2">
                                <Badge
                                  className={`${
                                    product.type === "free"
                                      ? "bg-green-600/20 text-green-400 border-green-500/30"
                                      : "bg-red-600/20 text-red-400 border-red-500/30"
                                  }`}
                                >
                                  {product.type === "free"
                                    ? "Gratuit"
                                    : "Payant"}
                                </Badge>

                                <Badge
                                  variant="outline"
                                  className={`${
                                    product.actionType === "discord"
                                      ? "border-purple-500/30 text-purple-400"
                                      : "border-blue-500/30 text-blue-400"
                                  }`}
                                >
                                  {product.actionType === "discord" ? (
                                    <>
                                      <LinkIcon className="w-3 h-3 mr-1" />
                                      Discord
                                    </>
                                  ) : (
                                    <>
                                      <Download className="w-3 h-3 mr-1" />
                                      Download
                                    </>
                                  )}
                                </Badge>

                                {product.type === "paid" && product.price && (
                                  <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                                    <Euro className="w-3 h-3 mr-1" />
                                    {product.price.toFixed(2)}€
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
                              className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10 hover:border-blue-500/50 transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProduct(product.id)}
                              className="border-red-600/50 text-red-400 hover:bg-red-600/10 hover:border-red-500/50 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <div className="p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl w-fit mx-auto mb-6">
                        <Package className="w-16 h-16 text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Votre Boutique Vous Attend !
                      </h3>
                      <p className="text-gray-400 max-w-md mx-auto mb-6">
                        Commencez à créer vos premiers produits numériques et
                        partagez votre talent avec le monde
                      </p>
                      <Button
                        onClick={() => setShowProductDialog(true)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Créer mon Premier Produit
                        <Heart className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Statistiques de votre Boutique
                </h2>
                <p className="text-gray-400">
                  Suivez les performances de vos produits et votre croissance
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-gray-800/50 bg-gradient-to-br from-purple-500/10 to-blue-500/5 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-600/20 rounded-xl">
                        <Package className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Produits</p>
                        <p className="text-3xl font-bold text-white">
                          {userProducts.length}
                        </p>
                        <p className="text-purple-400 text-xs">En ligne</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800/50 bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-600/20 rounded-xl">
                        <Heart className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Gratuits</p>
                        <p className="text-3xl font-bold text-white">
                          {userProducts.filter((p) => p.type === "free").length}
                        </p>
                        <p className="text-green-400 text-xs">Accessibles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-yellow-600/20 rounded-xl">
                        <Euro className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Payants</p>
                        <p className="text-3xl font-bold text-white">
                          {userProducts.filter((p) => p.type === "paid").length}
                        </p>
                        <p className="text-yellow-400 text-xs">Premium</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800/50 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-600/20 rounded-xl">
                        <Download className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Téléchargements</p>
                        <p className="text-3xl font-bold text-white">
                          {Math.floor(Math.random() * 100 + 50)}
                        </p>
                        <p className="text-blue-400 text-xs">Ce mois</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphique placeholder */}
              <Card className="border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Performance des Produits
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Évolution de vos ventes et téléchargements
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Graphiques Avancés
                    </h3>
                    <p className="text-gray-400">
                      Statistiques détaillées et graphiques disponibles bientôt
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ShopDashboard;
