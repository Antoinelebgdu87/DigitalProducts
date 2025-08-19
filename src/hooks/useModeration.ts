import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { db, shouldUseFirebase } from "@/lib/firebase";
import { ModerationAction, Product } from "@/types";
import { useAuth } from "@/context/AuthContext";

export const useModeration = () => {
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, username, isAdmin } = useAuth();

  // Helper function to convert Firestore data to ModerationAction objects
  const parseModerationAction = (actionData: any): ModerationAction => {
    return {
      ...actionData,
      createdAt: actionData.createdAt?.toDate() || new Date(),
    };
  };

  // Helper function to convert ModerationAction object to Firestore data
  const moderationActionToFirestore = (action: Omit<ModerationAction, "id">) => {
    return {
      ...action,
      createdAt: Timestamp.fromDate(action.createdAt),
    };
  };

  // Real-time listener for moderation actions
  useEffect(() => {
    if (!isAdmin()) {
      setLoading(false);
      return;
    }

    const loadModerationActions = () => {
      if (!shouldUseFirebase()) {
        // Use localStorage fallback
        try {
          const stored = localStorage.getItem("moderation_actions");
          if (stored) {
            const localActions = JSON.parse(stored);
            setModerationActions(
              localActions.map((action: any) => ({
                ...action,
                createdAt: new Date(action.createdAt),
              }))
            );
            console.log("🛡️ Actions de modération chargées depuis localStorage:", localActions.length);
          }
        } catch (error) {
          console.error("Error loading moderation actions from localStorage:", error);
        }
        setLoading(false);
        return;
      }

      const unsubscribe = onSnapshot(
        query(collection(db, "moderation_actions"), orderBy("createdAt", "desc")),
        (snapshot) => {
          try {
            const actionsData = snapshot.docs.map((doc) =>
              parseModerationAction({ id: doc.id, ...doc.data() }),
            );
            setModerationActions(actionsData);
            console.log("🛡️ Actions de modération chargées:", actionsData.length);
            // Save to localStorage as backup
            localStorage.setItem("moderation_actions", JSON.stringify(actionsData));
          } catch (error) {
            console.error("Error parsing moderation actions:", error);
            setModerationActions([]);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching moderation actions:", error);
          setModerationActions([]);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    };

    loadModerationActions();
  }, [isAdmin]);

  // Log a moderation action
  const logModerationAction = async (
    type: ModerationAction["type"],
    targetId: string,
    targetType: ModerationAction["targetType"],
    reason: string
  ): Promise<void> => {
    if (!isAdmin() || !userId || !username) {
      throw new Error("Permissions insuffisantes");
    }

    try {
      const action: ModerationAction = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        targetId,
        targetType,
        moderatorId: userId,
        moderatorUsername: username,
        reason,
        createdAt: new Date(),
      };

      if (shouldUseFirebase()) {
        await addDoc(collection(db, "moderation_actions"), moderationActionToFirestore(action));
        console.log("📝 Action de modération enregistrée:", type, targetId);
      } else {
        // localStorage fallback
        const currentActions = [...moderationActions, action];
        setModerationActions(currentActions);
        localStorage.setItem("moderation_actions", JSON.stringify(currentActions));
        console.log("📝 Action de modération enregistrée en mode offline:", type, targetId);
      }
    } catch (error) {
      console.error("Error logging moderation action:", error);
      throw error;
    }
  };

  // Delete a product with moderation logging
  const moderateDeleteProduct = async (productId: string, reason: string): Promise<void> => {
    if (!isAdmin()) {
      throw new Error("Permissions insuffisantes");
    }

    try {
      if (shouldUseFirebase()) {
        // Delete the product
        await deleteDoc(doc(db, "products", productId));
      }

      // Log the moderation action
      await logModerationAction("delete_product", productId, "product", reason);

      console.log("🗑️ Produit supprimé par modération:", productId);
    } catch (error) {
      console.error("Error moderating product deletion:", error);
      throw error;
    }
  };

  // Delete a comment with moderation logging
  const moderateDeleteComment = async (commentId: string, reason: string): Promise<void> => {
    if (!isAdmin()) {
      throw new Error("Permissions insuffisantes");
    }

    try {
      if (shouldUseFirebase()) {
        // Delete the comment
        await deleteDoc(doc(db, "comments", commentId));
      }

      // Log the moderation action
      await logModerationAction("delete_comment", commentId, "comment", reason);

      console.log("🗑️ Commentaire supprimé par modération:", commentId);
    } catch (error) {
      console.error("Error moderating comment deletion:", error);
      throw error;
    }
  };

  // Get all products by a specific user
  const getUserProducts = async (userId: string): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, "products"),
        where("createdBy", "==", userId),
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Product[];
      
      return products;
    } catch (error) {
      console.error("Error fetching user products:", error);
      return [];
    }
  };

  // Get moderation stats
  const getModerationStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActions = moderationActions.filter(
      action => action.createdAt >= today
    );

    const stats = {
      totalActions: moderationActions.length,
      todayActions: todayActions.length,
      deletedProducts: moderationActions.filter(a => a.type === "delete_product").length,
      deletedComments: moderationActions.filter(a => a.type === "delete_comment").length,
      bannedUsers: moderationActions.filter(a => a.type === "ban_user").length,
      warnedUsers: moderationActions.filter(a => a.type === "warn_user").length,
    };

    return stats;
  };

  return {
    moderationActions,
    loading,
    moderateDeleteProduct,
    moderateDeleteComment,
    logModerationAction,
    getUserProducts,
    getModerationStats,
  };
};
