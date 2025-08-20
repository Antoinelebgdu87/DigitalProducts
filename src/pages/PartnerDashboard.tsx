import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "@/context/TranslationContext";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Plus,
  Package,
  Edit,
  Trash2,
  Download,
  Euro,
  FileText,
  Link as LinkIcon,
  Crown,
  BarChart3,
  Users,
  TrendingUp,
  Star,
  Eye,
  Globe,
  ChevronDown,
  Sparkles,
  Zap,
  Award,
  Target,
  Calendar,
  Activity,
  DollarSign,
  Heart,
  MessageSquare,
  Share2,
  ExternalLink,
} from "lucide-react";
import SimpleStarsBackground from "@/components/SimpleStarsBackground";
import { toast } from "sonner";
import { Product } from "@/types";
import { Link, Navigate } from "react-router-dom";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import ProductModal from "@/components/ProductModal";

const LanguageSelector = () => {
  const { currentLanguage, setLanguage, AVAILABLE_LANGUAGES } = useTranslation();
  
  const flagMap = {
    fr: "🇫🇷",
    en: "🇺🇸", 
    pt: "🇵🇹",
    es: "🇪🇸",
    de: "🇩🇪",
    it: "🇮🇹"
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200"
        >
          <Globe className="w-4 h-4 mr-2" />
          <span className="mr-1">{flagMap[currentLanguage] || "🇫🇷"}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-md border-gray-700">
        {AVAILABLE_LANGUAGES?.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="text-white hover:bg-gray-700/50 cursor-pointer"
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        )) || (
          <>
            <DropdownMenuItem onClick={() => setLanguage("fr")} className="text-white hover:bg-gray-700/50 cursor-pointer">
              <span className="mr-2">🇫🇷</span>Français
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("en")} className="text-white hover:bg-gray-700/50 cursor-pointer">
              <span className="mr-2">🇺🇸</span>English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("pt")} className="text-white hover:bg-gray-700/50 cursor-pointer">
              <span className="mr-2">🇵🇹</span>Português
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const PartnerDashboard: React.FC = () => {
  useAutoTranslate();

  const { currentUser } = useUser();
  const {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    loading: productsLoading,
  } = useProducts();

  // Redirect if user doesn't have partner access
  if (!currentUser || currentUser.role !== "partner") {
    return <Navigate to="/" replace />;
  }

  // Filter products by current partner
  const partnerProducts = products.filter(
    (product) => product.createdBy === currentUser.id,
  );

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
      const productData = {
        ...productForm,
        createdBy: currentUser.id,
        createdByUsername: currentUser.username,
        partnerCreated: true,
      };
      await addProduct(productData);
      toast.success("🎉 Produit créé avec succès !");
      resetProductForm();
      setShowProductDialog(false);
    } catch (error) {
      toast.error("❌ Erreur lors de la création du produit");
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
      toast.success("✅ Produit mis à jour avec succès !");
      resetProductForm();
      setShowEditDialog(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error("❌ Erreur lors de la mise à jour du produit");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success("🗑️ Produit supprimé avec succès !");
    } catch (error) {
      toast.error("❌ Erreur lors de la suppression du produit");
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

  // Statistics calculations
  const totalProducts = partnerProducts.length;
  const freeProducts = partnerProducts.filter(p => p.type === "free").length;
  const paidProducts = partnerProducts.filter(p => p.type === "paid").length;
  const totalRevenue = partnerProducts.filter(p => p.type === "paid").reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="min-h-screen relative">
      <SimpleStarsBackground />

      <div className="relative z-10">
        {/* Modern Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>Espace Partenaire</span>
                    <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300 animate-pulse">
                      <Sparkles className="w-3 h-3 mr-1" />
                      PREMIUM
                    </Badge>
                  </h1>
                  <p className="text-sm text-gray-400">
                    Créez et gérez vos produits exclusifs • {currentUser.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <LanguageSelector />
                
                <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30 px-3 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  Partenaire Vérifié
                </Badge>
                
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 px-3 py-1">
                  {totalProducts} produit{totalProducts !== 1 ? "s" : ""}
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
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-yellow-600/10 border-yellow-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl">
                      <Award className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Bienvenue, Partenaire {currentUser.username} !
                      </h2>
                      <p className="text-gray-300">
                        Créez et gérez vos produits exclusifs avec tous les privilèges partenaire
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{totalProducts}</div>
                      <div className="text-xs text-gray-400">Produits Créés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{totalRevenue.toFixed(2)}€</div>
                      <div className="text-xs text-gray-400">Valeur Totale</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600/30 data-[state=active]:to-orange-600/30 data-[state=active]:text-yellow-300 transition-all duration-200"
              >
                <Package className="w-4 h-4 mr-2" />
                Mes Produits
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600/30 data-[state=active]:to-orange-600/30 data-[state=active]:text-yellow-300 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600/30 data-[state=active]:to-orange-600/30 data-[state=active]:text-yellow-300 transition-all duration-200"
              >
                <Zap className="w-4 h-4 mr-2" />
                Outils Pro
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Gestion des Produits</h2>
                  <p className="text-gray-400">
                    {totalProducts} produit{totalProducts !== 1 ? "s" : ""} dans votre catalogue partenaire
                  </p>
                </div>
                <Button 
                  onClick={() => setShowProductDialog(true)}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un Produit
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>

                {/* Product Creation Modal */}
                <ProductModal
                  isOpen={showProductDialog}
                  onOpenChange={setShowProductDialog}
                  onSubmit={handleProductSubmit}
                  formData={productForm}
                  setFormData={setProductForm}
                  title="Nouveau Produit Partenaire"
                  description="Créez un produit exclusif avec tous les privilèges partenaire"
                  submitButtonText="Créer le Produit"
                  submitButtonClass="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  icon={<Crown className="w-5 h-5 text-yellow-400" />}
                />

                {/* Product Edit Modal */}
                <ProductModal
                  isOpen={showEditDialog}
                  onOpenChange={(open) => {
                    setShowEditDialog(open);
                    if (!open) {
                      setEditingProduct(null);
                      resetProductForm();
                    }
                  }}
                  onSubmit={handleUpdateProduct}
                  formData={productForm}
                  setFormData={setProductForm}
                  title="Modifier le Produit Partenaire"
                  description="Modifiez votre produit exclusif partenaire"
                  submitButtonText="Sauvegarder"
                  submitButtonClass="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  icon={<Crown className="w-5 h-5 text-yellow-400" />}
                  isEdit={true}
                />
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="border-gray-800/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-600/20 rounded-lg">
                        <Package className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total</p>
                        <p className="text-xl font-bold text-white">{totalProducts}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-800/50 bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-600/20 rounded-lg">
                        <Heart className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Gratuits</p>
                        <p className="text-xl font-bold text-white">{freeProducts}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800/50 bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <Euro className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Payants</p>
                        <p className="text-xl font-bold text-white">{paidProducts}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800/50 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Valeur</p>
                        <p className="text-xl font-bold text-white">{totalRevenue.toFixed(2)}€</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Products Grid */}
              <div className="space-y-4">
                {partnerProducts.length > 0 ? (
                  partnerProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="border-gray-800/50 bg-gradient-to-r from-gray-900/80 to-gray-800/60 backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300 group"
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
                              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
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
                                      : "bg-purple-600/20 text-purple-400 border-purple-500/30"
                                  }`}
                                >
                                  {product.type === "free" ? "Gratuit" : "Payant"}
                                </Badge>
                                
                                <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Partenaire
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
                                    {product.price.toFixed(2)}
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
                              onClick={() => handleDeleteProduct(product.id)}
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
                      <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl w-fit mx-auto mb-6">
                        <Crown className="w-16 h-16 text-yellow-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Votre Empire Partenaire Commence Ici
                      </h3>
                      <p className="text-gray-400 max-w-md mx-auto mb-6">
                        Créez votre premier produit exclusif et commencez à partager votre expertise avec la communauté
                      </p>
                      <Button 
                        onClick={() => setShowProductDialog(true)}
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Créer mon Premier Produit
                        <Sparkles className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-gray-800/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-yellow-600/20 rounded-xl">
                        <Package className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Produits</p>
                        <p className="text-3xl font-bold text-white">{totalProducts}</p>
                        <p className="text-yellow-400 text-xs">+100% cette semaine</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800/50 bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-600/20 rounded-xl">
                        <Download className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Téléchargements</p>
                        <p className="text-3xl font-bold text-white">1.2K</p>
                        <p className="text-green-400 text-xs">+15% ce mois</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800/50 bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-600/20 rounded-xl">
                        <Euro className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Revenus Potentiels</p>
                        <p className="text-3xl font-bold text-white">{totalRevenue.toFixed(2)}€</p>
                        <p className="text-purple-400 text-xs">Valeur catalogue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800/50 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-600/20 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Performance</p>
                        <p className="text-3xl font-bold text-white">96%</p>
                        <p className="text-blue-400 text-xs">Satisfaction</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Aperçu Performance</CardTitle>
                  <CardDescription className="text-gray-400">
                    Votre activité en tant que partenaire
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Analytics Avancées</h3>
                    <p className="text-gray-400">
                      Graphiques et statistiques détaillées bientôt disponibles
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-gray-800/50 bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="p-3 bg-purple-600/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                      <Zap className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Boost Performance</h3>
                    <p className="text-gray-400 text-sm mb-4">Optimisez vos produits pour un maximum d'impact</p>
                    <Button variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                      Optimiser
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-800/50 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="p-3 bg-blue-600/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                      <Share2 className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Partage Social</h3>
                    <p className="text-gray-400 text-sm mb-4">Partagez vos produits sur les réseaux sociaux</p>
                    <Button variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                      Partager
                      <Share2 className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-gray-800/50 bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="p-3 bg-green-600/20 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                      <Target className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Ciblage Audience</h3>
                    <p className="text-gray-400 text-sm mb-4">Analysez votre audience et optimisez</p>
                    <Button variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10">
                      Analyser
                      <Activity className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Outils Partenaire Exclusifs</CardTitle>
                  <CardDescription className="text-gray-400">
                    Fonctionnalités avancées pour maximiser votre succès
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Outils Premium</h3>
                    <p className="text-gray-400">
                      Suite d'outils exclusifs pour partenaires en développement
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

export default PartnerDashboard;
