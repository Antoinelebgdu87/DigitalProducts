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
} from "firebase/firestore";
import { db, shouldUseFirebase, safeFirebaseOperation } from "@/lib/firebase";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useAdminMode } from "@/context/AdminModeContext";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId, username, userRole } = useAuth();
  const { canCreateProduct, getRemainingCooldown } = useAdminMode();

  // Helper function to convert Firestore data to Product objects
  const parseProduct = (productData: any): Product => {
    return {
      ...productData,
      createdAt: productData.createdAt?.toDate() || new Date(),
    };
  };

  // Helper function to convert Product object to Firestore data
  const productToFirestore = (product: Omit<Product, "id">) => {
    return {
      ...product,
      createdAt: Timestamp.fromDate(product.createdAt),
    };
  };

  // Real-time listener for products with Firebase fallback
  useEffect(() => {
    const loadProducts = async () => {
      if (!shouldUseFirebase()) {
        // Use localStorage in offline mode
        try {
          const stored = localStorage.getItem("products");
          if (stored) {
            const localProducts = JSON.parse(stored);
            console.log(
              "📦 Produits chargés depuis localStorage:",
              localProducts.length,
            );
            setProducts(
              localProducts.map((p: any) => ({
                ...p,
                createdAt: new Date(p.createdAt),
              })),
            );
          } else {
            setProducts([]);
          }
        } catch (error) {
          console.error("Error loading products from localStorage:", error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Use Firebase if available
      const unsubscribe = onSnapshot(
        query(collection(db, "products"), orderBy("createdAt", "desc")),
        (snapshot) => {
          try {
            const productsData = snapshot.docs.map((doc) =>
              parseProduct({ id: doc.id, ...doc.data() }),
            );
            setProducts(productsData);
            console.log("📦 Produits Firebase chargés:", productsData.length);

            // Also save to localStorage as backup
            localStorage.setItem("products", JSON.stringify(productsData));
          } catch (error) {
            console.error("Error parsing products:", error);
            setProducts([]);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching products:", error);
          // Fallback to localStorage
          try {
            const stored = localStorage.getItem("products");
            if (stored) {
              const localProducts = JSON.parse(stored);
              console.log(
                "📦 Fallback: produits chargés depuis localStorage",
                localProducts.length,
              );
              setProducts(
                localProducts.map((p: any) => ({
                  ...p,
                  createdAt: new Date(p.createdAt),
                })),
              );
            }
          } catch (localError) {
            console.log("⚠️ Aucun produit local trouvé");
          }
          setProducts([]);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    };

    loadProducts();
  }, []);

  // Migrate existing localStorage data on first load
  useEffect(() => {
    const migrateLocalStorage = async () => {
      try {
        const stored = localStorage.getItem("products");
        if (stored) {
          const localProducts = JSON.parse(stored) as Product[];
          console.log(
            "🔄 Migration de",
            localProducts.length,
            "produits vers Firebase...",
          );

          // Check if Firebase already has data
          const snapshot = await getDocs(collection(db, "products"));
          if (snapshot.empty) {
            // Migrate each product
            for (const product of localProducts) {
              const { id, ...productWithoutId } = product;
              const productData = {
                ...productWithoutId,
                createdAt: new Date(product.createdAt),
              };
              await addDoc(
                collection(db, "products"),
                productToFirestore(productData),
              );
            }
            console.log("✅ Migration des produits terminée");
            // Remove from localStorage after successful migration
            localStorage.removeItem("products");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la migration des produits:", error);
      }
    };

    migrateLocalStorage();
  }, []);

  const addProduct = async (
    productData: Omit<
      Product,
      "id" | "createdAt" | "createdBy" | "createdByUsername"
    >,
  ): Promise<void> => {
    try {
      // Vérifier si l'utilisateur peut créer un produit (cooldown)
      if (userRole === "shop_access") {
        const userProducts = products.filter((p) => p.createdBy === userId);
        const lastProduct = userProducts.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        )[0];

        if (lastProduct && !canCreateProduct(lastProduct.createdAt)) {
          const remaining = getRemainingCooldown(lastProduct.createdAt);
          throw new Error(
            `Vous devez attendre encore ${remaining} minute(s) avant de créer un nouveau produit.`,
          );
        }
      }

      const newProduct: Product = {
        ...productData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdBy: userId,
        createdByUsername: username,
        createdAt: new Date(),
      };

      if (shouldUseFirebase()) {
        await addDoc(
          collection(db, "products"),
          productToFirestore(newProduct),
        );
        console.log("🎉 Nouveau produit Firebase créé:", productData.title);
      } else {
        // localStorage fallback
        const currentProducts = [...products, newProduct];
        setProducts(currentProducts);
        localStorage.setItem("products", JSON.stringify(currentProducts));
        console.log(
          "🎉 Nouveau produit créé en mode offline:",
          productData.title,
        );
      }
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      console.log("🔄 deleteProduct appelé avec ID:", productId);
      console.log("📋 Produits actuels:", products.length);
      console.log("🔥 shouldUseFirebase():", shouldUseFirebase());

      if (shouldUseFirebase()) {
        console.log("🔥 Suppression Firebase...");
        await deleteDoc(doc(db, "products", productId));
        console.log("🗑️ Produit Firebase supprimé:", productId);
      } else {
        console.log("💾 Mode localStorage - suppression locale...");
        const currentProducts = products.filter((p) => p.id !== productId);
        console.log("📋 Produits après filtrage:", currentProducts.length, "produits restants");

        // Force immediate update
        setProducts([...currentProducts]);
        localStorage.setItem("products", JSON.stringify(currentProducts));

        console.log("🗑️ Produit supprimé en mode offline:", productId);
        console.log("💾 localStorage mis à jour avec", currentProducts.length, "produits");

        // Double check localStorage was updated
        const stored = localStorage.getItem("products");
        if (stored) {
          const parsedStored = JSON.parse(stored);
          console.log("✅ Vérification localStorage:", parsedStored.length, "produits stockés");
        }
      }
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      throw error;
    }
  };

  const updateProduct = async (
    productId: string,
    productData: Partial<Omit<Product, "id" | "createdAt">>,
  ): Promise<void> => {
    try {
      if (shouldUseFirebase()) {
        await updateDoc(doc(db, "products", productId), productData);
        console.log("📝 Produit Firebase mis à jour:", productId);
      } else {
        // localStorage fallback
        const updatedProducts = products.map((p) =>
          p.id === productId ? { ...p, ...productData } : p,
        );
        setProducts(updatedProducts);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        console.log("📝 Produit mis à jour en mode offline:", productId);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const fetchProducts = async () => {
    // This function is kept for compatibility but real-time updates handle the data
    if (!shouldUseFirebase()) {
      // In localStorage mode, force reload from localStorage
      try {
        const stored = localStorage.getItem("products");
        if (stored) {
          const localProducts = JSON.parse(stored);
          setProducts(
            localProducts.map((p: any) => ({
              ...p,
              createdAt: new Date(p.createdAt),
            })),
          );
          console.log("🔄 Force reload depuis localStorage:", localProducts.length, "produits");
        }
      } catch (error) {
        console.error("Error force reloading products:", error);
      }
    } else {
      console.log("📋 Produits gérés en temps réel via Firebase");
    }
  };

  // Fonctions pour vérifier les permissions
  const canUserCreateProduct = (): { canCreate: boolean; reason?: string } => {
    if (!userId || !username) {
      return { canCreate: false, reason: "Vous devez être connecté" };
    }

    if (!["admin", "shop_access", "partner"].includes(userRole)) {
      return {
        canCreate: false,
        reason: "Vous n'avez pas les permissions n��cessaires",
      };
    }

    if (userRole === "shop_access") {
      const userProducts = products.filter((p) => p.createdBy === userId);
      const lastProduct = userProducts.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0];

      if (lastProduct && !canCreateProduct(lastProduct.createdAt)) {
        const remaining = getRemainingCooldown(lastProduct.createdAt);
        return {
          canCreate: false,
          reason: `Cooldown: ${remaining} minute(s) restante(s)`,
        };
      }
    }

    return { canCreate: true };
  };

  const getUserProducts = (): Product[] => {
    return products.filter((p) => p.createdBy === userId);
  };

  return {
    products,
    loading,
    addProduct,
    deleteProduct,
    updateProduct,
    refetch: fetchProducts,
    canUserCreateProduct,
    getUserProducts,
  };
};
