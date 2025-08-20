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
                <Dialog
                  open={showProductDialog}
                  onOpenChange={setShowProductDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un Produit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Nouveau Produit Partenaire
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Ajoutez un nouveau produit exclusif à votre espace
                        partenaire
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
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Ajouter
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Edit Product Dialog */}
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                  <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Modifier le Produit Partenaire
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Modifiez les informations de votre produit exclusif
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProduct} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title" className="text-white">
                            Titre
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
                              <SelectItem value="free">Gratuit</SelectItem>
                              <SelectItem value="paid">Payant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-actionType" className="text-white">
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
                        <Label htmlFor="edit-description" className="text-white">
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

                      {productForm.actionType === "download" && (
                        <div className="space-y-2">
                          <Label htmlFor="edit-contentType" className="text-white">
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
                            <Label htmlFor="edit-downloadUrl" className="text-white">
                              URL de téléchargement
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
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Mettre à jour
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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
