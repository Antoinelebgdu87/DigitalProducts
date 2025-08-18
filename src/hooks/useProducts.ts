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
import { db } from "@/lib/firebase";
import { Product } from "@/types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to convert Firestore data to Product objects
  const parseProduct = (productData: any): Product => {
    return {
      ...productData,
      createdAt: productData.createdAt?.toDate() || new Date(),
    };
  };

  // Helper function to convert Product object to Firestore data
  const productToFirestore = (product: Omit<Product, 'id'>) => {
    return {
      ...product,
      createdAt: Timestamp.fromDate(product.createdAt),
    };
  };

  // Real-time listener for products
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "products"), orderBy("createdAt", "desc")),
      (snapshot) => {
        try {
          const productsData = snapshot.docs.map(doc => 
            parseProduct({ id: doc.id, ...doc.data() })
          );
          setProducts(productsData);
          console.log("📦 Produits Firebase chargés:", productsData.length);
        } catch (error) {
          console.error("Error parsing products:", error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Migrate existing localStorage data on first load
  useEffect(() => {
    const migrateLocalStorage = async () => {
      try {
        const stored = localStorage.getItem("products");
        if (stored) {
          const localProducts = JSON.parse(stored) as Product[];
          console.log("🔄 Migration de", localProducts.length, "produits vers Firebase...");
          
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
              await addDoc(collection(db, "products"), productToFirestore(productData));
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
    productData: Omit<Product, "id" | "createdAt">,
  ): Promise<void> => {
    try {
      const newProduct = {
        ...productData,
        createdAt: new Date(),
      };
      
      await addDoc(collection(db, "products"), productToFirestore(newProduct));
      console.log("🎉 Nouveau produit Firebase créé:", productData.name);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "products", productId));
      console.log("🗑️ Produit Firebase supprimé:", productId);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  const updateProduct = async (
    productId: string,
    productData: Partial<Omit<Product, "id" | "createdAt">>,
  ): Promise<void> => {
    try {
      await updateDoc(doc(db, "products", productId), productData);
      console.log("📝 Produit Firebase mis à jour:", productId);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const fetchProducts = async () => {
    // This function is kept for compatibility but real-time updates handle the data
    console.log("📋 Produits gérés en temps réel via Firebase");
  };

  return {
    products,
    loading,
    addProduct,
    deleteProduct,
    updateProduct,
    refetch: fetchProducts,
  };
};
