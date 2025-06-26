import React, { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Lock } from "lucide-react";
import { useLicenses } from "@/hooks/useLicenses";
import KeyValidator from "./KeyValidator";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const { validateLicense } = useLicenses();

  const handleDownload = () => {
    if (product.type === "free") {
      // Direct download for free products
      window.open(product.downloadUrl, "_blank");
    } else {
      // Show license input for paid products
      setShowLicenseInput(true);
    }
  };

  const handleLicenseValidate = async (licenseCode: string) => {
    return await validateLicense(licenseCode, product.id);
  };

  const handleDownload = () => {
    window.open(product.downloadUrl, "_blank");
  };

  return (
    <>
      <Card className="group hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-300 border-gray-800 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm">
        <CardHeader className="relative overflow-hidden">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-6xl">📦</div>
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <Badge
              variant={product.type === "free" ? "default" : "destructive"}
              className={
                product.type === "free"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {product.type === "free" ? "Gratuit" : "Payant"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
            {product.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {product.description}
          </p>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => {
              if (product.type === "free") {
                window.open(product.downloadUrl, "_blank");
              } else {
                setShowLicenseInput(true);
              }
            }}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
          >
            {product.type === "free" ? (
              <>
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Accéder avec clé
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {showLicenseInput && (
        <KeyValidator
          isOpen={showLicenseInput}
          onClose={() => setShowLicenseInput(false)}
          onValidate={handleLicenseValidate}
          onDownload={handleDownload}
          productTitle={product.title}
        />
      )}
    </>
  );
};

export default ProductCard;
