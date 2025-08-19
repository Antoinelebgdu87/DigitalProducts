import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  onSnapshot,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useAdminMode } from "@/context/AdminModeContext";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { adminMode } = useAdminMode();

  // Load products from Firebase with real-time updates
  useEffect(() => {
    console.log("🚀 Initialisation du hook useProducts...");

    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const initializeProducts = async () => {
      try {
        const productsQuery = query(
          collection(db, "products"),
          orderBy("createdAt", "desc")
        );

        unsubscribe = onSnapshot(
          productsQuery,
          (snapshot) => {
            if (!isMounted) return;

            try {
              const productsData = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  title: data.title,
                  description: data.description,
                  imageUrl: data.imageUrl,
                  downloadUrl: data.downloadUrl,
                  type: data.type || "free",
                  actionType: data.actionType || "download",
                  contentType: data.contentType || "link",
                  content: data.content || "",
                  discordUrl: data.discordUrl || "",
                  price: data.price || 0,
                  lives: data.lives || 1,
                  createdAt: data.createdAt || Timestamp.now(),
                } as Product;
              });

              setProducts(productsData);
              console.log("📦 Produits chargés depuis Firebase:", productsData.length);
            } catch (error) {
              console.error("❌ Erreur lors du traitement des produits:", error);
              setProducts([]);
            } finally {
              setLoading(false);
            }
          },
          (error) => {
            console.error("❌ Erreur lors de l'écoute des produits:", error);
            console.warn("🔄 Firebase non accessible - mode dégradé");
            setProducts([]);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error("❌ Erreur d'initialisation Firebase:", error);
        console.warn("🔄 Impossible de se connecter à Firebase - mode dégradé");
        setProducts([]);
        setLoading(false);
      }
    };

    initializeProducts();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const addProduct = async (
    productData: Omit<Product, "id" | "createdAt">
  ): Promise<void> => {
    try {
      console.log("➕ Ajout d'un nouveau produit:", productData.title);

      const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        createdAt: Timestamp.now(),
      });

      console.log("✅ Produit ajouté avec ID:", docRef.id);
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du produit:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      // Validation de l'ID
      if (!productId || typeof productId !== "string" || productId.trim() === "") {
        throw new Error(`ID de produit invalide: "${productId}"`);
      }

      // Vérifier que le produit existe
      const productToDelete = products.find((p) => p.id === productId);
      if (!productToDelete) {
        throw new Error(`Produit avec l'ID "${productId}" non trouvé`);
      }

      console.log(`🗑️ Suppression du produit: "${productToDelete.title}" (ID: ${productId})`);

      // Vérifier que le document existe dans Firebase
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error(`Le produit ${productId} n'existe pas dans Firebase`);
      }

      // Supprimer de Firebase
      await deleteDoc(docRef);
      console.log(`✅ Produit "${productToDelete.title}" supprimé avec succès de Firebase`);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error);
      throw error;
    }
  };

  const updateProduct = async (
    productId: string,
    productData: Partial<Omit<Product, "id" | "createdAt">>
  ): Promise<void> => {
    try {
      console.log("📝 Mise à jour du produit:", productId);

      const docRef = doc(db, "products", productId);
      await updateDoc(docRef, productData);
      
      console.log("✅ Produit mis à jour avec succès:", productId);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du produit:", error);
      throw error;
    }
  };

  const refetch = async (): Promise<void> => {
    try {
      console.log("🔄 Rechargement des produits depuis Firebase...");
      
      const productsQuery = query(
        collection(db, "products"),
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(productsQuery);
      const productsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt || Timestamp.now(),
        } as Product;
      });

      setProducts(productsData);
      console.log("✅ Produits rechargés:", productsData.length);
    } catch (error) {
      console.error("❌ Erreur lors du rechargement:", error);
      throw error;
    }
  };

  // Filter products based on admin mode
  const filteredProducts = adminMode?.isActive
    ? products
    : products.filter((product) =>
        adminMode?.timerSettings?.allowedProductTypes?.includes(product.type) ?? true
      );

  console.log(
    "📋 Produits gérés en temps réel via Firebase:",
    products.length,
    "produits"
  );

  return {
    products: filteredProducts,
    loading,
    addProduct,
    deleteProduct,
    updateProduct,
    refetch,
  };
};
