import { useProducts } from "./useProducts";
import { useProductsWithFallback } from "./useProductsWithFallback";
import { FirebaseService } from "@/lib/firebase-service";
import { useEffect, useState } from "react";

// Hook adapter qui choisit automatiquement la version appropriée
export const useProductsAdapter = () => {
  const [useFailsafe, setUseFailsafe] = useState(false);

  // Vérifier la connectivité Firebase au démarrage
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await FirebaseService.checkConnection();
        if (!isConnected) {
          console.warn(
            "🔄 Firebase connection issues detected, switching to fallback mode",
          );
          setUseFailsafe(true);
        }
      } catch (error) {
        console.error(
          "🔄 Firebase connection check failed, switching to fallback mode:",
          error,
        );
        setUseFailsafe(true);
      }
    };

    checkConnection();
  }, []);

  // Utiliser le hook approprié selon la connectivité
  const standardHook = useProducts();
  const fallbackHook = useProductsWithFallback();

  // Si on a détecté des problèmes ou si le hook standard a des erreurs, utiliser le fallback
  if (useFailsafe) {
    return fallbackHook;
  }

  return standardHook;
};

// Export par défaut pour faciliter la migration
export default useProductsAdapter;
