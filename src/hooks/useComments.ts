import { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Comment } from "@/types";
import { useUser } from "@/context/UserContext";
import {
  localCommentsService,
  shouldUseOfflineMode,
  markFirebaseError,
  markFirebaseWorking,
} from "@/lib/firebase-comments";

export const useComments = (productId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { currentUser } = useUser();

  // Helper function to convert Firestore data to Comment objects
  const parseComment = (commentData: any): Comment => {
    return {
      ...commentData,
      createdAt: commentData.createdAt?.toDate() || new Date(),
    };
  };

  // Helper function to convert Comment object to Firestore data
  const commentToFirestore = (comment: Omit<Comment, "id">) => {
    return {
      ...comment,
      createdAt: Timestamp.fromDate(comment.createdAt),
    };
  };

  // Load comments for specific product
  useEffect(() => {
    if (!productId) {
      setComments([]);
      setIsOfflineMode(false);
      return;
    }

    setLoading(true);

    // Vérifier si on doit utiliser le mode offline
    const useOffline = shouldUseOfflineMode();
    setIsOfflineMode(useOffline);

    if (useOffline) {
      console.log("📱 Mode offline activé pour les commentaires");
      // Utiliser le service local
      const unsubscribe = localCommentsService.subscribe(
        productId,
        (localComments) => {
          setComments(localComments);
          setLoading(false);
        },
      );
      return unsubscribe;
    }

    // Essayer Firebase d'abord
    const loadComments = () => {
      try {
        // Requête simplifiée sans orderBy pour éviter l'index composite
        const commentsQuery = query(
          collection(db, "comments"),
          where("productId", "==", productId),
        );

        const unsubscribe = onSnapshot(
          commentsQuery,
          (snapshot) => {
            try {
              const commentsData = snapshot.docs.map((doc) =>
                parseComment({ id: doc.id, ...doc.data() }),
              );
              // Trier côté client pour éviter l'index composite
              const sortedComments = commentsData.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
              );
              setComments(sortedComments);
              setLoading(false);
              setIsOfflineMode(false);
              markFirebaseWorking(); // Marquer Firebase comme fonctionnel
            } catch (error) {
              console.error("Erreur lors du parsing des commentaires:", error);
              fallbackToOffline();
            }
          },
          (error) => {
            console.error("Erreur listener commentaires:", error);
            markFirebaseError(); // Marquer l'erreur Firebase
            fallbackToOffline();
          },
        );

        return unsubscribe;
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation des commentaires:",
          error,
        );
        fallbackToOffline();
        return () => {}; // Retourne une fonction vide si erreur
      }
    };

    const fallbackToOffline = () => {
      console.log("🔄 Passage en mode offline pour les commentaires");
      setIsOfflineMode(true);
      // Basculer vers le service local
      const unsubscribe = localCommentsService.subscribe(
        productId,
        (localComments) => {
          setComments(localComments);
          setLoading(false);
        },
      );
      return unsubscribe;
    };

    const unsubscribe = loadComments();
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [productId]);

  const addComment = async (
    productId: string,
    content: string,
  ): Promise<void> => {
    if (!currentUser || !content.trim()) {
      throw new Error("Utilisateur non connecté ou commentaire vide");
    }

    const newComment: Omit<Comment, "id"> = {
      productId,
      userId: currentUser.id,
      username: currentUser.username,
      userRole: currentUser.role,
      content: content.trim(),
      createdAt: new Date(),
    };

    // Si on est en mode offline ou si Firebase a échoué récemment
    if (isOfflineMode || shouldUseOfflineMode()) {
      console.log("💬 Ajout de commentaire en mode offline");
      localCommentsService.addComment(newComment);
      return;
    }

    // Essayer Firebase d'abord
    try {
      await addDoc(collection(db, "comments"), commentToFirestore(newComment));
      console.log("💬 Commentaire ajouté avec succès via Firebase");
      markFirebaseWorking();
    } catch (error: any) {
      console.error(
        "Erreur lors de l'ajout du commentaire via Firebase:",
        error,
      );
      markFirebaseError();

      // Fallback vers le stockage local
      console.log("💬 Fallback: ajout de commentaire en mode local");
      localCommentsService.addComment(newComment);

      // Informer l'utilisateur que le commentaire a été sauvé localement
      throw new Error(
        "Commentaire sauvé localement. Il sera synchronisé quand la connexion reviendra.",
      );
    }
  };

  const deleteComment = async (commentId: string): Promise<void> => {
    // Si on est en mode offline ou si le commentaire est local
    if (isOfflineMode || commentId.startsWith("local_")) {
      console.log("🗑️ Suppression de commentaire en mode offline");
      const success = localCommentsService.deleteComment(commentId);
      if (!success) {
        throw new Error("Commentaire introuvable.");
      }
      return;
    }

    // Essayer Firebase d'abord
    try {
      await deleteDoc(doc(db, "comments", commentId));
      console.log("🗑️ Commentaire supprimé avec succès via Firebase");
      markFirebaseWorking();
    } catch (error: any) {
      console.error(
        "Erreur lors de la suppression du commentaire via Firebase:",
        error,
      );
      markFirebaseError();

      // Fallback vers le stockage local si le commentaire existe localement
      const success = localCommentsService.deleteComment(commentId);
      if (success) {
        console.log("🗑️ Fallback: suppression de commentaire en mode local");
        throw new Error(
          "Commentaire supprimé localement. Il sera synchronisé quand la connexion reviendra.",
        );
      } else {
        throw new Error(
          "Impossible de supprimer le commentaire. Vérifiez votre connexion internet.",
        );
      }
    }
  };

  const canDeleteComment = (comment: Comment): boolean => {
    if (!currentUser) return false;
    // Admin peut supprimer tous les commentaires, utilisateur peut supprimer les siens
    return currentUser.role === "admin" || comment.userId === currentUser.id;
  };

  return {
    comments,
    loading,
    isOfflineMode,
    addComment,
    deleteComment,
    canDeleteComment,
  };
};
