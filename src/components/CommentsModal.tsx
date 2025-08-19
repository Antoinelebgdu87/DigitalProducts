import React, { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Send,
  Trash2,
  User,
  Shield,
  Package,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Comment } from "@/types";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  productId,
  productTitle,
}) => {
  const { currentUser } = useUser();
  const {
    comments,
    loading,
    addComment,
    deleteComment,
    canDeleteComment,
  } = useComments(productId);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      await addComment(productId, newComment);
      setNewComment("");
      toast.success("Commentaire ajouté avec succès!");
    } catch (error: any) {
      const errorMessage =
        error.message || "Erreur lors de l'ajout du commentaire";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success("Commentaire supprimé avec succès!");
    } catch (error: any) {
      const errorMessage =
        error.message || "Erreur lors de la suppression du commentaire";
      toast.error(errorMessage);
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-400" />;
      case "shop_access":
        return <Package className="w-4 h-4 text-purple-400" />;
      case "partner":
        return <User className="w-4 h-4 text-yellow-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
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
      default:
        return "bg-gray-600 text-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            <span>Commentaires</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {productTitle} • {comments.length} commentaire(s)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Liste des commentaires */}
          <ScrollArea className="h-96">
            <div className="space-y-3 pr-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-400">
                    Chargement des commentaires...
                  </span>
                </div>
              ) : isOfflineMode && comments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MessageCircle className="w-6 h-6 text-orange-400" />
                  </div>
                  <p className="text-orange-400 font-medium">Mode hors ligne</p>
                  <p className="text-gray-500 text-sm">
                    Les commentaires sont stockés localement
                  </p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">
                    Aucun commentaire pour le moment
                  </p>
                  <p className="text-gray-500 text-sm">
                    Soyez le premier à commenter!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <Card
                    key={comment.id}
                    className="border-gray-700 bg-gray-800/50"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            {getRoleIcon(comment.userRole)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-white font-medium text-sm">
                                {comment.username}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getRoleColor(comment.userRole)}`}
                              >
                                {getRoleLabel(comment.userRole)}
                              </Badge>
                              <span className="text-gray-500 text-xs">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed break-words">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                        {canDeleteComment(comment) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Formulaire d'ajout de commentaire */}
          {currentUser ? (
            isOfflineMode ? (
              <div className="bg-orange-900/50 border border-orange-700 rounded-lg p-4 text-center">
                <p className="text-orange-400 text-sm">
                  Mode offline : vos commentaires seront synchronisés plus tard
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="newComment" className="text-white text-sm">
                    Ajouter un commentaire
                  </Label>
                  <Textarea
                    id="newComment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Écrivez votre commentaire..."
                    className="bg-gray-800 border-gray-700 text-white resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      {newComment.length}/500 caractères
                    </span>
                    <Button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      size="sm"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? "Envoi..." : "Envoyer"}
                    </Button>
                  </div>
                </div>
              </form>
            )
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">
                Vous devez être connecté pour commenter
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-300"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsModal;
