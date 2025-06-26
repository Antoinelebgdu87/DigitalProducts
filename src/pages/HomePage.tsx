import React from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  const { products, loading } = useProducts();

  return (
    <div className="min-h-screen relative">
      <BackgroundAnimation />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                  Digital Products Store
                </h1>
                <p className="text-gray-300 mt-2">
                  Produits numériques premium • 100% anonyme
                </p>
              </div>
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-800/50"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
                <p className="text-gray-300">Chargement des produits...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Aucun produit disponible
              </h2>
              <p className="text-gray-400">
                Les produits seront bientôt disponibles.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Nos Produits
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Découvrez notre collection de produits numériques. Les
                  produits gratuits sont téléchargeables immédiatement, les
                  produits payants nécessitent une licence temporaire.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-400">
              <p>© 2024 Digital Products Store • Tous droits réservés</p>
              <p className="text-sm mt-2">100% anonyme • Aucun compte requis</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
