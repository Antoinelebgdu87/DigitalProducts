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

export const useComments = (productId?: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
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
      return;
    }

    setLoading(true);

    const loadComments = () => {
      try {
        // Requête simplifiée sans orderBy pour éviter l'index composite
        const commentsQuery = query(
          collection(db, "comments"),
          where("productId", "==", productId)
        );

        const unsubscribe = onSnapshot(
          commentsQuery,
          (snapshot) => {
            try {
              const commentsData = snapshot.docs.map((doc) =>
                parseComment({ id: doc.id, ...doc.data() })
              );
              // Trier côté client pour éviter l'index composite
              const sortedComments = commentsData.sort((a, b) =>
                b.createdAt.getTime() - a.createdAt.getTime()
              );
              setComments(sortedComments);
              setLoading(false);
            } catch (error) {
              console.error("Erreur lors du parsing des commentaires:", error);
              setComments([]);
              setLoading(false);
            }
          },
          (error) => {
            console.error("Erreur listener commentaires:", error);

            // Gestion spécifique des erreurs réseau
            if (error.code === 'unavailable' || error.message.includes('Failed to fetch')) {
              console.log("🔄 Problème de connectivité détecté, mode offline activé");
              // En cas d'erreur réseau, on garde un état vide mais on arrête le loading
              setComments([]);
              setLoading(false);
            } else {
              // Pour autres erreurs, on garde les commentaires vides
              setComments([]);
              setLoading(false);
            }
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error("Erreur lors de l'initialisation des commentaires:", error);
        setComments([]);
        setLoading(false);
        return () => {}; // Retourne une fonction vide si erreur
      }
    };

    const unsubscribe = loadComments();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [productId]);

  const addComment = async (productId: string, content: string): Promise<void> => {
    if (!currentUser || !content.trim()) {
      throw new Error("Utilisateur non connecté ou commentaire vide");
    }

    try {
      const newComment: Omit<Comment, "id"> = {
        productId,
        userId: currentUser.id,
        username: currentUser.username,
        userRole: currentUser.role,
        content: content.trim(),
        createdAt: new Date(),
      };

      await addDoc(collection(db, "comments"), commentToFirestore(newComment));
      console.log("💬 Commentaire ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "comments", commentId));
      console.log("🗑️ Commentaire supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      throw error;
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
    addComment,
    deleteComment,
    canDeleteComment,
  };
};
