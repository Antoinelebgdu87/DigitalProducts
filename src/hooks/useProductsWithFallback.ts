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
import { FirebaseService } from "@/lib/firebase-service";
import FirebaseFallback from "@/lib/firebase-fallback";

export const useProductsWithFallback = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { adminMode } = useAdminMode();

  // Load products with fallback support
  useEffect(() => {
    console.log("🚀 Initialisation du hook useProducts avec fallback...");

    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const initializeProducts = async () => {
      try {
        // D'abord essayer de charger depuis le fallback
        const fallbackProducts = FirebaseFallback.getFromFallback("products");
        if (fallbackProducts && Array.isArray(fallbackProducts)) {
          console.log(
            "📦 Chargement des produits depuis le cache:",
            fallbackProducts.length,
          );
          setProducts(fallbackProducts);
          setLoading(false);
        }

        // Ensuite essayer Firebase
        const loadFromFirebase = async () => {
          const productsQuery = query(
            collection(db, "products"),
            orderBy("createdAt", "desc"),
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
                    createdBy: data.createdBy || "",
                    createdByUsername: data.createdByUsername || "Inconnu",
                    price: data.price || 0,
                    lives: data.lives || 1,
                    createdAt: data.createdAt || Timestamp.now(),
                  } as Product;
                });

                setProducts(productsData);
                setConnectionError(null);

                // Sauvegarder en fallback
                FirebaseFallback.saveToFallback("products", productsData);

                console.log(
                  "📦 Produits chargés depuis Firebase:",
                  productsData.length,
                );
              } catch (error) {
                console.error(
                  "❌ Erreur lors du traitement des produits:",
                  error,
                );
                // En cas d'erreur, garder les données de fallback si disponibles
                if (!fallbackProducts) {
                  setProducts(FirebaseFallback.getDefaultData("products"));
                }
              } finally {
                setLoading(false);
              }
            },
            (error) => {
              console.error("❌ Erreur lors de l'écoute des produits:", error);
              setConnectionError("Connexion Firebase interrompue");

              // Utiliser les données de fallback ou par défaut
              const fallbackData =
                FirebaseFallback.getFromFallback("products") ||
                FirebaseFallback.getDefaultData("products");
              setProducts(fallbackData);
              setLoading(false);
            },
          );
        };

        // Essayer Firebase avec retry
        await FirebaseService.withRetry(loadFromFirebase);
      } catch (error) {
        console.error("❌ Erreur d'initialisation Firebase:", error);
        setConnectionError("Impossible de se connecter à Firebase");

        // Utiliser les données de fallback ou par défaut
        const fallbackData =
          FirebaseFallback.getFromFallback("products") ||
          FirebaseFallback.getDefaultData("products");
        setProducts(fallbackData);
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
    productData: Omit<Product, "id" | "createdAt">,
  ): Promise<void> => {
    return FirebaseService.safeGet(
      async () => {
        console.log("➕ Ajout d'un nouveau produit:", productData.title);

        const docRef = await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: Timestamp.now(),
        });

        console.log("✅ Produit ajouté avec ID:", docRef.id);
      },
      "add_product_operation",
      undefined,
    );
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    return FirebaseService.safeGet(
      async () => {
        if (
          !productId ||
          typeof productId !== "string" ||
          productId.trim() === ""
        ) {
          throw new Error(`ID de produit invalide: "${productId}"`);
        }

        const productToDelete = products.find((p) => p.id === productId);
        if (!productToDelete) {
          throw new Error(`Produit avec l'ID "${productId}" non trouvé`);
        }

        console.log(
          `🗑️ Suppression du produit: "${productToDelete.title}" (ID: ${productId})`,
        );

        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error(`Le produit ${productId} n'existe pas dans Firebase`);
        }

        await deleteDoc(docRef);
        console.log(
          `✅ Produit "${productToDelete.title}" supprimé avec succès`,
        );
      },
      "delete_product_operation",
      undefined,
    );
  };

  const updateProduct = async (
    productId: string,
    productData: Partial<Omit<Product, "id" | "createdAt">>,
  ): Promise<void> => {
    return FirebaseService.safeGet(
      async () => {
        console.log("📝 Mise à jour du produit:", productId);

        const docRef = doc(db, "products", productId);
        await updateDoc(docRef, productData);

        console.log("✅ Produit mis à jour avec succès:", productId);
      },
      "update_product_operation",
      undefined,
    );
  };

  const refetch = async (): Promise<void> => {
    return FirebaseService.safeGet(
      async () => {
        console.log("🔄 Rechargement des produits depuis Firebase...");

        const productsQuery = query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
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
        FirebaseFallback.saveToFallback("products", productsData);
        console.log("✅ Produits rechargés:", productsData.length);
      },
      "refetch_products",
      undefined,
    );
  };

  // Filter products based on admin mode
  const filteredProducts = adminMode?.isActive
    ? products
    : products.filter(
        (product) =>
          adminMode?.timerSettings?.allowedProductTypes?.includes(
            product.type,
          ) ?? true,
      );

  console.log("📋 Produits gérés avec fallback:", products.length, "produits");

  return {
    products: filteredProducts,
    loading,
    addProduct,
    deleteProduct,
    updateProduct,
    refetch,
    connectionError,
    isOffline: FirebaseService.isOffline(),
  };
};
