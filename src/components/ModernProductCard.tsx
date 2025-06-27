import React, { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Lock, Star, Eye, ShoppingCart } from "lucide-react";
import { useLicenses } from "@/hooks/useLicenses";
import KeyValidator from "./KeyValidator";

interface ModernProductCardProps {
  product: Product;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({ product }) => {
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { validateLicense } = useLicenses();

  const handleLicenseValidate = async (licenseCode: string) => {
    return await validateLicense(licenseCode, product.id);
  };

  const handleValidatedDownload = () => {
    window.open(product.downloadUrl, "_blank");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-red-500/20 to-red-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Main card */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          {/* Image container */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900 to-black">
            {product.imageUrl ? (
              <motion.img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="text-6xl filter grayscale"
                  animate={{
                    rotate: isHovered ? 10 : 0,
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  📦
                </motion.div>
              </div>
            )}

            {/* Overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="flex space-x-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isHovered ? 1 : 0.8,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </motion.div>
            </motion.div>

            {/* Product type badge */}
            <div className="absolute top-4 left-4">
              <Badge
                variant={product.type === "free" ? "default" : "destructive"}
                className={`${
                  product.type === "free"
                    ? "bg-gradient-to-r from-green-500 to-green-600 border-0"
                    : "bg-gradient-to-r from-red-500 to-red-600 border-0"
                } text-white font-semibold px-3 py-1 rounded-full shadow-lg`}
              >
                {product.type === "free" ? "FREE" : "PREMIUM"}
              </Badge>
            </div>

            {/* Rating (fake for demo) */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm font-medium">4.8</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <motion.h3
                className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors duration-300"
                animate={{
                  x: isHovered ? 4 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {product.title}
              </motion.h3>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>2.3k</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>12.5k</span>
                </div>
              </div>
              <div className="text-red-400 font-semibold">
                {product.type === "free" ? "Free" : "$9.99"}
              </div>
            </div>

            {/* Action button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => {
                  if (product.type === "free") {
                    window.open(product.downloadUrl, "_blank");
                  } else {
                    setShowLicenseInput(true);
                  }
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-red-500/50 group"
                size="lg"
              >
                {product.type === "free" ? (
                  <>
                    <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Download Now
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Get Access
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-red-500/50 opacity-0 group-hover:opacity-100"
            animate={{
              borderColor: isHovered
                ? [
                    "rgba(239, 68, 68, 0.5)",
                    "rgba(220, 38, 38, 0.8)",
                    "rgba(239, 68, 68, 0.5)",
                  ]
                : "rgba(239, 68, 68, 0.5)",
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {showLicenseInput && (
        <KeyValidator
          isOpen={showLicenseInput}
          onClose={() => setShowLicenseInput(false)}
          onValidate={handleLicenseValidate}
          onDownload={handleValidatedDownload}
          productTitle={product.title}
        />
      )}
    </>
  );
};

export default ModernProductCard;
