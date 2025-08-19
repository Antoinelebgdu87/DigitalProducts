import React, { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Lock, Star, Eye, ShoppingCart, Euro, MessageCircle, ExternalLink } from "lucide-react";
import { useLicenses } from "@/hooks/useLicenses";
import { useComments } from "@/hooks/useComments";
import KeyValidator from "./KeyValidator";
import NotepadViewer from "./NotepadViewer";
import CommentsModal from "./CommentsModal";

interface ModernProductCardProps {
  product: Product;
}

const ModernProductCard: React.FC<ModernProductCardProps> = ({ product }) => {
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { validateLicense } = useLicenses();
  const { comments } = useComments(product.id);

  const handleLicenseValidate = async (licenseCode: string) => {
    return await validateLicense(licenseCode, product.id);
  };

  const handleValidatedDownload = () => {
    if (product.actionType === "discord") {
      // Action validée = Discord
      window.open(product.discordUrl, "_blank");
    } else {
      // Action validée = Download (comportement par défaut)
      if (!product.contentType || product.contentType === "link") {
        window.open(product.downloadUrl, "_blank");
      } else {
        setShowNotepad(true);
      }
    }
  };

  return (
    <>
      <div
        className="group relative hover:-translate-y-2 transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 via-red-500/20 to-red-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Main card */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          {/* Image container */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-900 to-black">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl filter grayscale group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  📦
                </div>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="flex space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowComments(true);
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Commentaires ({comments.length})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Preview clicked");
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>

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
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
                {product.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Prix */}
            <div className="flex items-center justify-end text-sm">
              <div className="text-red-400 font-semibold flex items-center">
                {product.type === "free" ? (
                  "Gratuit"
                ) : (
                  <>
                    <Euro className="w-4 h-4 mr-1" />
                    {product.price?.toFixed(2) || "9.99"}
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="relative z-10 space-y-3">
              {/* Main action button */}
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Button clicked!", product.type, product.title, product.actionType);

                  if (product.actionType === "discord") {
                    // Action principale = Discord
                    if (product.type === "free") {
                      window.open(product.discordUrl, "_blank");
                    } else {
                      setShowLicenseInput(true);
                    }
                  } else {
                    // Action principale = Download (comportement par défaut)
                    if (product.type === "free") {
                      if (
                        !product.contentType ||
                        product.contentType === "link"
                      ) {
                        window.open(product.downloadUrl, "_blank");
                      } else {
                        setShowNotepad(true);
                      }
                    } else {
                      setShowLicenseInput(true);
                    }
                  }
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-red-500/50 cursor-pointer pointer-events-auto"
                size="lg"
                style={{ pointerEvents: "auto" }}
              >
                {product.actionType === "discord" ? (
                  product.type === "free" ? (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Join Discord
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Get Discord Access
                    </>
                  )
                ) : (
                  product.type === "free" ? (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Now
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Get Access
                    </>
                  )
                )}
              </Button>

              {/* Secondary button (only if main action is download and discord URL exists) */}
              {product.actionType === "download" && product.discordUrl && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(product.discordUrl, "_blank");
                  }}
                  variant="outline"
                  className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Join Discord
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl border-2 border-red-500/50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
        </div>
      </div>

      {showLicenseInput && (
        <KeyValidator
          isOpen={showLicenseInput}
          onClose={() => setShowLicenseInput(false)}
          onValidate={handleLicenseValidate}
          onDownload={handleValidatedDownload}
          productTitle={product.title}
        />
      )}

      {showNotepad && (
        <NotepadViewer
          isOpen={showNotepad}
          onClose={() => setShowNotepad(false)}
          title={product.title}
          content={product.content || "Aucun contenu disponible."}
        />
      )}
    </>
  );
};

export default ModernProductCard;
