import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Loader2,
  Download,
  Lock,
  Star,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import StarfieldBackground from "./StarfieldBackground";
import ModernProductCard from "./ModernProductCard";
import UsernameModal from "./UsernameModal";
import BanModal from "./BanModal";
import WarningModal from "./WarningModal";
import { useUser } from "@/context/UserContext";

const ModernHomePage: React.FC = () => {
  const { products, loading } = useProducts();
  const { currentUser, checkUserStatus, markWarningsAsRead } = useUser();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    // Check if user needs to create a username
    if (!currentUser) {
      setShowUsernameModal(true);
    } else {
      // Check if user is banned
      checkUserStatus();

      // Check for unread warnings
      const unreadWarnings = currentUser.warnings?.filter(w => !w.isRead) || [];
      if (unreadWarnings.length > 0) {
        setShowWarningModal(true);
      }
    }
  }, [currentUser, checkUserStatus]);

  const handleWarningClose = async () => {
    if (currentUser) {
      await markWarningsAsRead(currentUser.id);
      setShowWarningModal(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const features = [
    {
      icon: Shield,
      title: "100% Anonymous",
      description: "No registration required",
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Download immediately",
    },
    {
      icon: Globe,
      title: "Premium Quality",
      description: "Curated digital products",
    },
    {
      icon: Star,
      title: "Secure Delivery",
      description: "Safe & reliable downloads",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarfieldBackground />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DigitalHub
              </span>
            </motion.div>

            <div className="flex items-center space-x-3">
              {currentUser && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {currentUser.username}
                  </span>
                </div>
              )}
              <Link to="/admin">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-white/10 border border-white/20"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 pt-20 pb-32"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div variants={itemVariants} className="mb-8" />

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
              Digital Products
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              Redefined
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Discover exceptional digital products with instant access.
            <br />
            <span className="text-red-400">No accounts, no hassle.</span> Just
            pure digital excellence.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => {
                  const productsSection = document.querySelector(
                    '[data-section="products"]',
                  );
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-4 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
              >
                Explore Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const featuresSection = document.querySelector(
                    '[data-section="features"]',
                  );
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10 rounded-2xl backdrop-blur-sm"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            data-section="features"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 text-red-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Products Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        data-section="products"
        className="relative z-10 pb-20"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Featured
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                {" "}
                Products
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Handpicked collection of premium digital assets, tools, and
              resources for creators and professionals.
            </motion.p>
          </div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-12 h-12 text-red-500 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Loading Products
                </h3>
                <p className="text-gray-400">
                  Fetching the latest digital products...
                </p>
              </div>
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-4xl">D</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Coming Soon
              </h3>
              <p className="text-lg text-gray-400 max-w-md mx-auto">
                Amazing products are being curated for you. Stay tuned for
                something incredible!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                >
                  <ModernProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl mt-20"
      >
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DigitalHub
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              © 2025 DigitalHub • All rights reserved
            </p>
            <p className="text-sm text-gray-500">
              Premium digital marketplace • 100% anonymous • Instant access
            </p>
          </div>
        </div>
      </motion.footer>

      {/* Username Modal */}
      <UsernameModal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
      />

      {/* Ban Modal */}
      {currentUser?.isBanned && (
        <BanModal
          isOpen={true}
          reason={currentUser.banReason || "Aucune raison spécifiée"}
        />
      )}

      {/* Warning Modal */}
      {currentUser && (
        <WarningModal
          isOpen={showWarningModal}
          warnings={currentUser.warnings || []}
          onClose={handleWarningClose}
        />
      )}
    </div>
  );
};

export default ModernHomePage;
