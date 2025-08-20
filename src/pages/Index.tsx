import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useProducts } from "@/hooks/useProducts";
import { useTranslation } from "@/context/TranslationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Crown,
  Store,
  Shield,
  Sparkles,
  ArrowRight,
  Package,
  Users,
  TrendingUp,
  Zap,
  Star,
  Download,
  Heart,
  Eye,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SimpleStarsBackground from "@/components/SimpleStarsBackground";
import ProductCard from "@/components/ProductCard";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

const LanguageSelector = () => {
  const { currentLanguage, setLanguage, AVAILABLE_LANGUAGES } = useTranslation();
  
  const flagMap = {
    fr: "🇫🇷",
    en: "🇺🇸", 
    pt: "🇵🇹",
    es: "🇪🇸",
    de: "🇩🇪",
    it: "🇮🇹"
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200"
        >
          <Globe className="w-4 h-4 mr-2" />
          <span className="mr-1">{flagMap[currentLanguage] || "🇫🇷"}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-md border-gray-700">
        {AVAILABLE_LANGUAGES?.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="text-white hover:bg-gray-700/50 cursor-pointer"
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        )) || (
          <>
            <DropdownMenuItem onClick={() => setLanguage("fr")} className="text-white hover:bg-gray-700/50 cursor-pointer">
              <span className="mr-2">🇫🇷</span>Français
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("en")} className="text-white hover:bg-gray-700/50 cursor-pointer">
              <span className="mr-2">🇺🇸</span>English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("pt")} className="text-white hover:bg-gray-700/50 cursor-pointer">
              <span className="mr-2">🇵🇹</span>Português
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HeroSection = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!currentUser) return "/";
    switch (currentUser.role) {
      case "admin": return "/admin";
      case "partner": return "/partner";
      case "shop_access": return "/shop";
      default: return "/";
    }
  };

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <div className="mb-8">
          <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-300 mb-4">
            <Sparkles className="w-4 h-4 mr-1" />
            Digital Excellence Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              DigitalHub
            </span>
            <br />
            <span className="text-4xl md:text-5xl font-medium text-gray-200">
              Nouvelle Génération
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Découvrez des produits numériques exceptionnels avec un accès instantané. 
            Pas de compte, pas de complications. Juste de l'excellence numérique pure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={() => navigate(getDashboardPath())}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {currentUser ? "Accéder au Dashboard" : "Explorer les Produits"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            className="border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-3 rounded-xl font-medium text-lg transition-all duration-200"
          >
            En savoir plus
            <Eye className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* User Role Badge */}
        {currentUser && (
          <div className="flex justify-center mb-8">
            <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="px-6 py-3">
                <div className="flex items-center space-x-3">
                  {currentUser.role === "admin" && (
                    <>
                      <Shield className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium">Administrateur</span>
                    </>
                  )}
                  {currentUser.role === "partner" && (
                    <>
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Partenaire Officiel</span>
                    </>
                  )}
                  {currentUser.role === "shop_access" && (
                    <>
                      <Store className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-400 font-medium">Accès Boutique</span>
                    </>
                  )}
                  {currentUser.role === "user" && (
                    <>
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-medium">Utilisateur</span>
                    </>
                  )}
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">{currentUser.username}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Accès Instantané",
      description: "Téléchargement immédiat sans délai",
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "100% Sécurisé",
      description: "Transactions protégées et téléchargements fiables",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <Star className="w-8 h-8 text-purple-400" />,
      title: "Qualité Premium",
      description: "Produits numériques sélectionnés avec soin",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "100% Anonyme",
      description: "Aucune inscription requise",
      gradient: "from-green-500/20 to-emerald-500/20"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pourquoi Choisir DigitalHub ?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Une expérience révolutionnaire pour découvrir et accéder aux meilleurs produits numériques
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm hover:border-gray-700/50 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className={`p-3 bg-gradient-to-r ${feature.gradient} rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductsSection = () => {
  const { products, loading } = useProducts();
  
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Produits en Vedette
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Collection s��lectionnée d'actifs numériques premium, outils et ressources pour créateurs et professionnels
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-gray-800/50 bg-gray-900/50 animate-pulse">
                <CardContent className="p-6">
                  <div className="w-full h-48 bg-gray-800 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">Bientôt Disponible</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Des produits incroyables sont en cours de sélection pour vous. Restez à l'écoute pour quelque chose d'extraordinaire !
              </p>
            </CardContent>
          </Card>
        )}

        {featuredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-3 rounded-xl font-medium"
            >
              Voir tous les produits
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

const StatsSection = () => {
  const { products } = useProducts();
  
  const stats = [
    {
      icon: <Download className="w-6 h-6 text-blue-400" />,
      value: "10K+",
      label: "Téléchargements",
    },
    {
      icon: <Package className="w-6 h-6 text-green-400" />,
      value: products.length.toString(),
      label: "Produits Disponibles",
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      value: "5K+",
      label: "Utilisateurs Actifs",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-yellow-400" />,
      value: "99.9%",
      label: "Satisfaction",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  useAutoTranslate();

  return (
    <div className="min-h-screen relative">
      <SimpleStarsBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">DigitalHub</h1>
                  <p className="text-xs text-gray-400">Excellence Numérique</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <LanguageSelector />
                
                <Link to="/admin">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <HeroSection />
          <FeaturesSection />
          <StatsSection />
          <ProductsSection />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">DigitalHub</span>
              </div>
              <p className="text-gray-400 text-sm">
                © 2024 DigitalHub. Tous droits réservés. Excellence numérique garantie.
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Conditions d'utilisation
                </Link>
                <span className="text-gray-600">•</span>
                <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Politique de confidentialité
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
