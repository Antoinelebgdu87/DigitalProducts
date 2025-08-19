import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ModerationAction, Product } from "@/types";

export const useModeration = () => {
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Load moderation actions from Firebase
  useEffect(() => {
    console.log("🚀 Initialisation du hook useModeration...");
    
    let isMounted = true;
    
    const moderationQuery = query(
      collection(db, "moderation_actions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      moderationQuery,
      (snapshot) => {
        if (!isMounted) return;

        try {
          const actionsData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              type: data.type,
              targetId: data.targetId,
              targetType: data.targetType,
              reason: data.reason,
              moderatorId: data.moderatorId || "system",
              createdAt: data.createdAt || Timestamp.now(),
              metadata: data.metadata || {},
            } as ModerationAction;
          });

          setModerationActions(actionsData);
          console.log("🛡️ Actions de modération chargées depuis Firebase:", actionsData.length);
        } catch (error) {
          console.error("❌ Erreur lors du traitement des actions de modération:", error);
          setModerationActions([]);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("❌ Erreur lors de l'écoute des actions de modération:", error);
        setModerationActions([]);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Log a moderation action
  const logModerationAction = async (
    type: string,
    targetId: string,
    targetType: string,
    reason: string,
    metadata: Record<string, any> = {}
  ): Promise<void> => {
    try {
      console.log("📝 Enregistrement d'une action de modération:", { type, targetId, targetType, reason });

      const action: Omit<ModerationAction, "id"> = {
        type,
        targetId,
        targetType,
        reason,
        moderatorId: "admin", // Could be dynamic based on current user
        createdAt: Timestamp.now(),
        metadata,
      };

      await addDoc(collection(db, "moderation_actions"), action);
      console.log("✅ Action de modération enregistrée");
    } catch (error) {
      console.error("❌ Erreur lors de l'enregistrement de l'action de modération:", error);
      throw error;
    }
  };

  // Delete a product with moderation logging
  const moderateDeleteProduct = async (
    productId: string,
    reason: string
  ): Promise<void> => {
    try {
      console.log("🗑️ Suppression modérée du produit:", productId);

      // Delete the product
      await deleteDoc(doc(db, "products", productId));
      
      // Log the moderation action
      await logModerationAction(
        "delete_product",
        productId,
        "product",
        reason
      );

      console.log("✅ Produit supprimé avec modération:", productId);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression modérée du produit:", error);
      throw error;
    }
  };

  // Delete a comment with moderation logging
  const moderateDeleteComment = async (
    commentId: string,
    reason: string
  ): Promise<void> => {
    try {
      console.log("🗑️ Suppression modérée du commentaire:", commentId);

      // Delete the comment
      await deleteDoc(doc(db, "comments", commentId));
      
      // Log the moderation action
      await logModerationAction(
        "delete_comment",
        commentId,
        "comment",
        reason
      );

      console.log("✅ Commentaire supprimé avec modération:", commentId);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression modérée du commentaire:", error);
      throw error;
    }
  };

  // Get products created by a specific user
  const getUserProducts = async (userId: string): Promise<Product[]> => {
    try {
      console.log("🔍 Recherche des produits de l'utilisateur:", userId);

      const q = query(
        collection(db, "products"),
        where("createdBy", "==", userId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      console.log("📦 Produits trouvés pour l'utilisateur:", products.length);
      return products;
    } catch (error) {
      console.error("❌ Erreur lors de la recherche des produits utilisateur:", error);
      return [];
    }
  };

  // Get moderation statistics
  const getModerationStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    const todayActions = moderationActions.filter((action) => {
      const actionDate = action.createdAt.toDate();
      return actionDate >= today;
    });

    const stats = {
      totalActions: moderationActions.length,
      todayActions: todayActions.length,
      deletedProducts: moderationActions.filter((a) => a.type === "delete_product").length,
      deletedComments: moderationActions.filter((a) => a.type === "delete_comment").length,
      bannedUsers: moderationActions.filter((a) => a.type === "ban_user").length,
      deletedUsers: moderationActions.filter((a) => a.type === "delete_user").length,
    };

    return stats;
  };

  // Get recent moderation actions (last 10)
  const getRecentActions = () => {
    return moderationActions.slice(0, 10);
  };

  console.log(
    "🛡️ Actions de modération gérées en temps réel via Firebase:",
    moderationActions.length,
    "actions"
  );

  return {
    moderationActions,
    loading,
    logModerationAction,
    moderateDeleteProduct,
    moderateDeleteComment,
    getUserProducts,
    getModerationStats,
    getRecentActions,
  };
};
