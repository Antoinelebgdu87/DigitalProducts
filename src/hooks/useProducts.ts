import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types";

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Listen to real-time changes in Firebase
      const productsRef = collection(db, "products");
      const q = query(productsRef, orderBy("createdAt", "desc"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const productsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as Product;
        });
        
        setProducts(productsData);
        setIsLoading(false);
        setError(null);
        console.log("🛍️ Produits chargés depuis Firebase:", productsData.length);
      }, (error) => {
        console.error("Erreur lors du chargement des produits:", error);
        setError("Erreur lors du chargement des produits");
        setIsLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Erreur lors de l'initialisation des produits:", error);
      setError("Erreur lors de l'initialisation");
      setIsLoading(false);
    }
  }, []);

  const addProduct = async (
    productData: Omit<Product, "id" | "createdAt">,
  ): Promise<void> => {
    try {
      const newProduct = {
        ...productData,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "products"), newProduct);
      console.log("🛍️ Produit ajouté dans Firebase:", productData.name);
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
      throw new Error("Erreur lors de l'ajout du produit");
    }
  };

  const updateProduct = async (
    productId: string,
    updates: Partial<Product>,
  ): Promise<void> => {
    try {
      const productRef = doc(db, "products", productId);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      await updateDoc(productRef, updateData);
      console.log("🛍️ Produit mis à jour dans Firebase:", productId);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      throw new Error("Erreur lors de la mise à jour du produit");
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "products", productId));
      console.log("🛍️ Produit supprimé de Firebase:", productId);
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      throw new Error("Erreur lors de la suppression du produit");
    }
  };

  return {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
