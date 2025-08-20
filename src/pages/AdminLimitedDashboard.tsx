import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { useModeration } from "@/hooks/useModeration";
import { useComments } from "@/hooks/useComments";
// Firebase toujours utilisé
import HeaderLogo from "@/components/HeaderLogo";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  LogOut,
  Package,
  Shield,
  User,
  UserCheck,
  MessageSquare,
  Trash2,
  AlertTriangle,
  Users,
} from "lucide-react";
import SimpleStarsBackground from "@/components/SimpleStarsBackground";
import { toast } from "sonner";
import { Product } from "@/types";
import { useUser } from "@/context/UserContext";

const AdminLimitedDashboard: React.FC = () => {
  const { logout } = useAuth();
  const {
    products,
    refetch: refetchProducts,
    loading: productsLoading,
  } = useProducts();
  const { users, banUser, unbanUser, addWarning, updateUserRole } = useUser();
  const {
    moderationActions,
    moderateDeleteProduct,
    moderateDeleteComment,
    getModerationStats,
    logModerationAction,
  } = useModeration();
  const { comments: allComments } = useComments();

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
  const [banDuration, setBanDuration] = useState<string>("permanent");
  const [customBanHours, setCustomBanHours] = useState<number>(24);
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");

  // Messages prédéfinis pour ban/warn
  const predefinedBanReasons = [
    "Comportement toxique et harcèlement",
    "Spam répété dans les commentaires",
    "Violation des règles de la communauté",
    "Contenu inapproprié ou offensant",
    "Tentative de contournement des systèmes",
    "Utilisation abusive des fonctionnalités",
    "Partage de contenu illégal",
    "Tentative de phishing/arnaque",
  ];

  const predefinedWarnReasons = [
    "Attention au langage utilisé",
    "Merci de respecter les autres utilisateurs",
    "Évitez le spam dans les commentaires",
    "Contenu non approprié pour cette section",
    "Respectez les règles de la communauté",
    "Message hors-sujet supprimé",
    "Avertissement pour comportement limite",
    "Rappel des règles d'utilisation",
  ];

  const banDurationOptions = [
    { value: "1h", label: "1 heure", hours: 1 },
    { value: "6h", label: "6 heures", hours: 6 },
    { value: "12h", label: "12 heures", hours: 12 },
    { value: "24h", label: "24 heures", hours: 24 },
    { value: "3d", label: "3 jours", hours: 72 },
    { value: "7d", label: "7 jours", hours: 168 },
    { value: "30d", label: "30 jours", hours: 720 },
    { value: "custom", label: "Personnalisé", hours: 0 },
    { value: "permanent", label: "Permanent", hours: 0 },
  ];

  // Moderation states
  const [showModerationDialog, setShowModerationDialog] = useState(false);
  const [moderationTarget, setModerationTarget] = useState<{
    id: string;
    type: "product" | "comment";
    title: string;
  } | null>(null);
  const [moderationReason, setModerationReason] = useState("");

  const formatDate = (date: any) => {
    try {
      let validDate: Date;

      if (!date) {
        return "Date inconnue";
      }

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

  const handleBanUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !banReason.trim()) return;

    try {
      let banExpiresAt = null;
      if (banDuration !== "permanent") {
        const hours =
          banDuration === "custom"
            ? customBanHours
            : banDurationOptions.find((o) => o.value === banDuration)?.hours ||
              0;
        banExpiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      }

      await banUser(selectedUserId, banReason, banExpiresAt);

      const message =
        banDuration === "permanent"
          ? "Utilisateur banni définitivement"
          : `Utilisateur banni jusqu'au ${banExpiresAt?.toLocaleString("fr-FR")}`;

      toast.success(message);
      setShowBanDialog(false);
      setBanReason("");
      setBanDuration("permanent");
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
      await logModerationAction(
        "unban_user",
        selectedUserId,
        "user",
        "Utilisateur débanni par l'administration",
      );
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

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()),
  );

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

                <Badge className="bg-blue-600 text-white">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Administrateur Limité
                </Badge>

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
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-blue-600"
              >
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-blue-600"
              >
                <User className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="moderation"
                className="data-[state=active]:bg-blue-600"
              >
                <Shield className="w-4 h-4 mr-2" />
                Modération
              </TabsTrigger>
            </TabsList>

            {/* Products Tab (View Only) */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Gestion des Produits (Lecture seule)
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {products.length} produit(s) total - Accès en lecture seule
                  </p>
                </div>
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
                            onClick={() => {
                              setModerationTarget({
                                id: product.id,
                                type: "product",
                                title: product.title,
                              });
                              setShowModerationDialog(true);
                            }}
                            className="border-orange-700 text-orange-400 hover:bg-orange-500/10"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Modérer
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Gestion des Utilisateurs
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {users.length} utilisateur(s) enregistré(s)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white w-64"
                  />
                </div>
              </div>

              <div className="grid gap-4">
                {filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="border-gray-800 bg-gray-900/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {user.username}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {user.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={getRoleColor(user.role)}>
                                {getRoleLabel(user.role)}
                              </Badge>
                              {user.isBanned && (
                                <Badge variant="destructive">
                                  Banni
                                  {user.banExpiresAt && (
                                    <span className="ml-1">
                                      jusqu'au {formatDate(user.banExpiresAt)}
                                    </span>
                                  )}
                                </Badge>
                              )}
                              <span className="text-gray-500 text-xs">
                                Inscrit le {formatDate(user.createdAt)}
                              </span>
                            </div>
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
                            className="border-blue-700 text-blue-400 hover:bg-blue-500/10"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Rôle
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setShowWarnDialog(true);
                            }}
                            className="border-yellow-700 text-yellow-400 hover:bg-yellow-500/10"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Avertir
                          </Button>
                          {user.isBanned ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setShowUnbanDialog(true);
                              }}
                              className="border-green-700 text-green-400 hover:bg-green-500/10"
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              Débannir
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setShowBanDialog(true);
                              }}
                              className="border-red-700 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Bannir
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Moderation Tab */}
            <TabsContent value="moderation" className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Centre de Modération
                </h2>
                <p className="text-gray-400 text-sm">
                  Gérez les actions de modération et surveillez le contenu
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-600/20 rounded-lg">
                        <Shield className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          Actions Aujourd'hui
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {getModerationStats().todayActions}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-600/20 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          Commentaires Totaux
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {allComments.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-gray-900/50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-600/20 rounded-lg">
                        <Users className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          Utilisateurs Bannis
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {users.filter((u) => u.isBanned).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Moderation Actions */}
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white">
                    Actions de Modération Récentes
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Historique des dernières actions de modération
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {moderationActions.slice(0, 10).map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0"
                    >
                      <div className="flex items-center space-x-3">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-white text-sm">{action.action}</p>
                          <p className="text-gray-400 text-xs">
                            {action.reason}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-500 text-xs">
                        {formatDate(action.timestamp)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Dialogs */}
      {/* Ban User Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              Bannir l'utilisateur
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Sélectionnez la durée du bannissement et la raison
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBanUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banDuration" className="text-white">
                Durée du bannissement
              </Label>
              <Select value={banDuration} onValueChange={setBanDuration}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {banDurationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {banDuration === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customHours" className="text-white">
                  Nombre d'heures personnalisé
                </Label>
                <Input
                  id="customHours"
                  type="number"
                  min="1"
                  value={customBanHours}
                  onChange={(e) => setCustomBanHours(parseInt(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="banReason" className="text-white">
                Raison du bannissement
              </Label>
              <Select value={banReason} onValueChange={setBanReason}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Sélectionnez une raison..." />
                </SelectTrigger>
                <SelectContent>
                  {predefinedBanReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBanDialog(false)}
                className="border-gray-700"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={!banReason.trim()}
              >
                Bannir
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Warn User Dialog */}
      <Dialog open={showWarnDialog} onOpenChange={setShowWarnDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              Avertir l'utilisateur
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Envoyez un avertissement à l'utilisateur
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWarnUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="warnReason" className="text-white">
                Raison de l'avertissement
              </Label>
              <Select value={warnReason} onValueChange={setWarnReason}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Sélectionnez une raison..." />
                </SelectTrigger>
                <SelectContent>
                  {predefinedWarnReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowWarnDialog(false)}
                className="border-gray-700"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-yellow-600 hover:bg-yellow-700"
                disabled={!warnReason.trim()}
              >
                Avertir
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier le rôle</DialogTitle>
            <DialogDescription className="text-gray-400">
              Changez le rôle de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateRole} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userRole" className="text-white">
                Nouveau rôle
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
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="shop_access">Accès Boutique</SelectItem>
                  <SelectItem value="partner">Partenaire</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRoleDialog(false)}
                className="border-gray-700"
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Mettre à jour
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Unban User Dialog */}
      <Dialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              Débannir l'utilisateur
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Confirmez le débannissement de cet utilisateur
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUnbanUser} className="space-y-4">
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUnbanDialog(false)}
                className="border-gray-700"
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Débannir
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Moderation Dialog */}
      <Dialog
        open={showModerationDialog}
        onOpenChange={setShowModerationDialog}
      >
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              Action de Modération
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Supprimer le contenu: {moderationTarget?.title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleModerateDelete} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moderationReason" className="text-white">
                Raison de la suppression
              </Label>
              <Input
                id="moderationReason"
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Expliquez la raison de la suppression..."
                required
              />
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
                Supprimer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLimitedDashboard;
