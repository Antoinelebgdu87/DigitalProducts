import { useState, useEffect } from "react";
// Temporarily comment out Firebase imports to debug
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   doc,
//   orderBy,
//   query,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";
import { Product } from "@/types";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      // Load from localStorage instead of Firebase
      const stored = localStorage.getItem("products");
      if (stored) {
        const productsData = JSON.parse(stored) as Product[];
        setProducts(productsData);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    localStorage.setItem("products", JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const addProduct = async (
    productData: Omit<Product, "id" | "createdAt">,
  ): Promise<void> => {
    try {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      const updatedProducts = [newProduct, ...products];
      saveProducts(updatedProducts);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      const updatedProducts = products.filter((p) => p.id !== productId);
      saveProducts(updatedProducts);
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
      const updatedProducts = products.map((p) =>
        p.id === productId ? { ...p, ...productData } : p,
      );
      saveProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
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
