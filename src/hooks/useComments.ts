import { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
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
    console.log("🔍 Parse comment data:", {
      id: commentData.id,
      username: commentData.username,
      avatarUrl: commentData.avatarUrl,
      hasAvatar: !!commentData.avatarUrl
    });

    return {
      id: commentData.id,
      productId: commentData.productId,
      userId: commentData.userId,
      username: commentData.username,
      userRole: commentData.userRole || "user", // Ajout du rôle utilisateur avec valeur par défaut
      content: commentData.content,
      createdAt: commentData.createdAt || Timestamp.now(),
      avatarUrl: commentData.avatarUrl, // Inclure l'avatar
    };
  };

  // Load comments from Firebase with real-time updates
  useEffect(() => {
    if (!productId) {
      console.log("⚠️ useComments: productId is undefined/empty");
      setComments([]);
      setLoading(false);
      return;
    }

    console.log("🚀 Chargement des commentaires pour le produit:", productId);
    setLoading(true);

    let isMounted = true;

    try {
      const commentsQuery = query(
        collection(db, "comments"),
        where("productId", "==", productId),
        orderBy("createdAt", "desc"),
      );

      console.log("🔍 Query créée pour les commentaires de:", productId);

      const unsubscribe = onSnapshot(
        commentsQuery,
        (snapshot) => {
          if (!isMounted) return;

          try {
            console.log("📊 Snapshot reçu:", snapshot.size, "documents");

            const commentsData = snapshot.docs.map((doc) => {
              const data = doc.data();
              console.log("📝 Document commentaire:", doc.id, data);
              return parseComment({
                id: doc.id,
                ...data,
              });
            });

            setComments(commentsData);
            console.log(
              "💬 Commentaires chargés depuis Firebase:",
              commentsData.length,
              "pour le produit",
              productId,
            );
          } catch (error) {
            console.error(
              "❌ Erreur lors du traitement des commentaires:",
              error,
            );
            setComments([]);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("❌ Erreur lors de l'écoute des commentaires:", error);
          console.error(
            "🔥 Firebase error details:",
            error.code,
            error.message,
          );
          setComments([]);
          setLoading(false);
        },
      );

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (error) {
      console.error("❌ Erreur lors de la création de la query:", error);
      setComments([]);
      setLoading(false);
    }
  }, [productId]);

  // Load all comments (for admin use)
  useEffect(() => {
    if (productId) return; // Only load all comments if no specific productId

    console.log("🚀 Chargement de tous les commentaires...");
    setLoading(true);

    let isMounted = true;

    const commentsQuery = query(
      collection(db, "comments"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snapshot) => {
        if (!isMounted) return;

        try {
          const commentsData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return parseComment({
              id: doc.id,
              ...data,
            });
          });

          setComments(commentsData);
          console.log(
            "💬 Tous les commentaires chargés depuis Firebase:",
            commentsData.length,
          );
        } catch (error) {
          console.error(
            "❌ Erreur lors du traitement des commentaires:",
            error,
          );
          setComments([]);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("❌ Erreur lors de l'écoute des commentaires:", error);
        setComments([]);
        setLoading(false);
      },
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [productId]);

  const addComment = async (
    productId: string,
    content: string,
    rating?: number,
    parentId?: string,
  ): Promise<void> => {
    if (!currentUser) {
      throw new Error("Vous devez être connecté pour commenter");
    }

    try {
      console.log("➕ Ajout d'un commentaire pour le produit:", productId);
      console.log("👤 Current user data:", {
        id: currentUser.id,
        username: currentUser.username,
        role: currentUser.role,
        avatarUrl: currentUser.avatarUrl,
        hasAvatar: !!currentUser.avatarUrl
      });

      const commentData = {
        productId,
        userId: currentUser.id,
        username: currentUser.username,
        userRole: currentUser.role, // Inclure le rôle utilisateur
        content,
        createdAt: Timestamp.now(),
        avatarUrl: currentUser.avatarUrl, // Inclure l'avatar
      };

      console.log("💾 Comment data to save:", commentData);

      await addDoc(collection(db, "comments"), commentData);
      console.log("✅ Commentaire ajouté avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du commentaire:", error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string): Promise<void> => {
    try {
      console.log("🗑️ Suppression du commentaire:", commentId);

      await deleteDoc(doc(db, "comments", commentId));
      console.log("✅ Commentaire supprimé avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du commentaire:", error);
      throw error;
    }
  };

  const canDeleteComment = (comment: Comment): boolean => {
    if (!currentUser) return false;
    // Admin peut supprimer tous les commentaires, utilisateur peut supprimer les siens
    return currentUser.role === "admin" || comment.userId === currentUser.id;
  };

  const getAverageRating = (): number => {
    if (comments.length === 0) return 0;

    const ratingsOnly = comments.filter((c) => c.rating > 0);
    if (ratingsOnly.length === 0) return 0;

    const sum = ratingsOnly.reduce((acc, comment) => acc + comment.rating, 0);
    return Math.round((sum / ratingsOnly.length) * 10) / 10;
  };

  const getRatingsDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    comments.forEach((comment) => {
      if (comment.rating >= 1 && comment.rating <= 5) {
        distribution[comment.rating as keyof typeof distribution]++;
      }
    });

    return distribution;
  };

  console.log(
    "💬 Commentaires gérés en temps réel via Firebase:",
    comments.length,
    "commentaires",
  );

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    canDeleteComment,
    getAverageRating,
    getRatingsDistribution,
  };
};
