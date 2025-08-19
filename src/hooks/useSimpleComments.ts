import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/context/UserContext";

export interface SimpleComment {
  id: string;
  productId: string;
  userId: string;
  username: string;
  userRole: string;
  content: string;
  createdAt: any;
}

export const useSimpleComments = (productId: string) => {
  const [comments, setComments] = useState<SimpleComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();

  // Load comments in real-time
  useEffect(() => {
    if (!productId) {
      setComments([]);
      setLoading(false);
      return;
    }

    console.log("🔄 Loading comments for product:", productId);
    setLoading(true);

    const q = query(
      collection(db, "simple_comments"),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as SimpleComment[];

        console.log("💬 Comments loaded:", commentsData.length);
        setComments(commentsData);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error loading comments:", error);
        setComments([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [productId]);

  // Add comment
  const addComment = async (content: string) => {
    if (!currentUser || !content.trim()) {
      throw new Error("User not logged in or empty content");
    }

    try {
      console.log("➕ Adding comment...");
      
      await addDoc(collection(db, "simple_comments"), {
        productId,
        userId: currentUser.id,
        username: currentUser.username,
        userRole: currentUser.role,
        content: content.trim(),
        createdAt: serverTimestamp(),
      });

      console.log("✅ Comment added successfully");
    } catch (error) {
      console.error("❌ Error adding comment:", error);
      throw error;
    }
  };

  // Delete comment
  const deleteComment = async (commentId: string) => {
    try {
      console.log("🗑️ Deleting comment:", commentId);
      await deleteDoc(doc(db, "simple_comments", commentId));
      console.log("✅ Comment deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting comment:", error);
      throw error;
    }
  };

  // Check if user can delete comment
  const canDeleteComment = (comment: SimpleComment): boolean => {
    if (!currentUser) return false;
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
