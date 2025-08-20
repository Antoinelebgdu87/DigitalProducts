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
  FileText,
  Link as LinkIcon,
  Crown,
  BarChart3,
  Users,
} from "lucide-react";
import SimpleStarsBackground from "@/components/SimpleStarsBackground";
import { toast } from "sonner";
import { Product } from "@/types";
import { Link, Navigate } from "react-router-dom";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import ProductModal from "@/components/ProductModal";

const PartnerDashboard: React.FC = () => {
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
      // Add createdBy fields for partner products
      const productData = {
        ...productForm,
        createdBy: currentUser.id,
        createdByUsername: currentUser.username,
        partnerCreated: true, // Mark as partner-created
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

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success("Produit supprimé avec succès!");
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit");
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
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Crown className="w-8 h-8 text-yellow-500" />
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    Espace Partenaire
                  </h1>
                  <p className="text-gray-400 text-xs">
                    Gérez vos produits exclusifs en tant que partenaire
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-600 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Partenaire
                </Badge>
                <Badge
                  variant="outline"
                  className="border-yellow-500 text-yellow-400"
                >
                  {partnerProducts.length} produit(s)
                </Badge>
                <Link to="/">
                  <Button
                    variant="outline"
                    className="border-gray-500 text-gray-400 hover:bg-gray-500/10"
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
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-yellow-600"
              >
                <Package className="w-4 h-4 mr-2" />
                Mes Produits
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="data-[state=active]:bg-yellow-600"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Statistiques
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Gestion des Produits Partenaire
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {partnerProducts.length} produit(s) dans votre espace
                    partenaire
                  </p>
                </div>
                <Button
                  onClick={() => setShowProductDialog(true)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un Produit
                </Button>

                {/* Nouvelle modale de création de produit partenaire */}
                <ProductModal
                  isOpen={showProductDialog}
                  onOpenChange={setShowProductDialog}
                  onSubmit={handleProductSubmit}
                  formData={productForm}
                  setFormData={setProductForm}
                  title="Nouveau Produit Partenaire"
                  description="Ajoutez un nouveau produit exclusif à votre espace partenaire"
                  submitButtonText="Créer le Produit"
                  submitButtonClass="bg-yellow-600 hover:bg-yellow-700"
                  icon={<Crown className="w-5 h-5 text-yellow-400" />}
                />

                {/* Modale d'édition de produit partenaire */}
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
                  description="Modifiez les informations de votre produit exclusif"
                  submitButtonText="Mettre à jour"
                  submitButtonClass="bg-yellow-600 hover:bg-yellow-700"
                  icon={<Crown className="w-5 h-5 text-yellow-400" />}
                  isEdit={true}
                />

              </div>

              <div className="grid gap-4">
                {partnerProducts.map((product) => (
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
                              <Badge
                                variant="outline"
                                className="border-yellow-500 text-yellow-400"
                              >
                                <Crown className="w-3 h-3 mr-1" />
                                Partenaire
                              </Badge>
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
                                <Badge
                                  variant="outline"
                                  className="border-yellow-500 text-yellow-400"
                                >
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
                            className="border-blue-700 text-blue-400 hover:bg-blue-500/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="border-red-700 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {partnerProducts.length === 0 && (
                  <Card className="border-gray-800 bg-gray-900/50">
                    <CardContent className="p-12 text-center">
                      <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Aucun produit partenaire
                      </h3>
                      <p className="text-gray-400">
                        Commencez par ajouter votre premier produit exclusif en
                        tant que partenaire
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Statistiques Partenaire
                </h2>
                <p className="text-gray-400 text-sm">
                  Suivez les performances de vos produits exclusifs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-yellow-600/20 rounded-lg">
                        <Package className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Produits</p>
                        <p className="text-2xl font-bold text-white">
                          {partnerProducts.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-600/20 rounded-lg">
                        <Download className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          Produits Gratuits
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {
                            partnerProducts.filter((p) => p.type === "free")
                              .length
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-600/20 rounded-lg">
                        <Euro className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          Produits Payants
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {
                            partnerProducts.filter((p) => p.type === "paid")
                              .length
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default PartnerDashboard;
