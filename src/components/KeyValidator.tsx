import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Key,
  Loader2,
  CheckCircle,
  XCircle,
  CreditCard,
  User,
  Zap,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { License } from "@/types";

interface KeyValidatorProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (
    licenseCode: string,
  ) => Promise<{ isValid: boolean; license?: License }>;
  onDownload: () => void;
  productTitle: string;
}

const KeyValidator: React.FC<KeyValidatorProps> = ({
  isOpen,
  onClose,
  onValidate,
  onDownload,
  productTitle,
}) => {
  const [licenseCode, setLicenseCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    license?: License;
  } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "compte":
        return <User className="w-5 h-5" />;
      case "carte-cadeau":
        return <CreditCard className="w-5 h-5" />;
      case "cheat":
        return <Zap className="w-5 h-5" />;
      default:
        return <Key className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "compte":
        return "Account";
      case "carte-cadeau":
        return "Gift Card";
      case "cheat":
        return "Cheat";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "compte":
        return "bg-blue-600";
      case "carte-cadeau":
        return "bg-purple-600";
      case "cheat":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseCode.trim()) {
      toast.error("Please enter a license key");
      return;
    }

    setIsLoading(true);
    setShowResult(false);

    try {
      // Mini loading animation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await onValidate(licenseCode.trim());
      setValidationResult(result);
      setShowResult(true);

      if (result.isValid) {
        toast.success("🎉 Key validated successfully!");
      } else {
        toast.error("❌ Invalid or depleted key");
      }
    } catch (error) {
      toast.error("Validation error");
      setValidationResult({ isValid: false });
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    onDownload();
    setLicenseCode("");
    setValidationResult(null);
    setShowResult(false);
    onClose();
  };

  const formatLicenseCode = (value: string) => {
    // Garder le format original de la clé de licence
    return value.trim();
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicenseCode(e.target.value);
    if (showResult) {
      setShowResult(false);
      setValidationResult(null);
    }
  };

  const reset = () => {
    setLicenseCode("");
    setValidationResult(null);
    setShowResult(false);
    setIsLoading(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader className="text-center">
          <DialogTitle className="text-white flex items-center justify-center gap-2 text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            Key Validation
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Enter your key to access{" "}
            <span className="font-semibold text-red-400">{productTitle}</span>
          </DialogDescription>
        </DialogHeader>

        {!showResult ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="license" className="text-white text-base">
                License Key
              </Label>
              <div className="relative">
                <Input
                  id="license"
                  value={licenseCode}
                  onChange={handleLicenseChange}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500 text-lg py-6 pl-12"
                  disabled={isLoading}
                />
                <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {isLoading && (
              <Card className="bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-l-red-400 rounded-full animate-spin animation-delay-150"></div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-white font-medium">
                        Validation in progress...
                      </p>
                      <p className="text-gray-400 text-sm">Checking key</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              disabled={isLoading || !licenseCode.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-6 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Validate Key
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            {validationResult?.isValid ? (
              <Card className="bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-500/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-green-400 mb-2">
                      Key Validated!
                    </h3>
                    <p className="text-gray-300">
                      Your access has been confirmed
                    </p>
                  </div>

                  {validationResult.license && (
                    <div className="space-y-3 pt-4 border-t border-green-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Key type:</span>
                        <Badge
                          className={`${getCategoryColor(validationResult.license.category)} text-white`}
                        >
                          <span className="mr-2">
                            {getCategoryIcon(validationResult.license.category)}
                          </span>
                          {getCategoryLabel(validationResult.license.category)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Usage:</span>
                        <span className="text-white font-mono">
                          {validationResult.license.currentUsages} /{" "}
                          {validationResult.license.maxUsages}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-600 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(validationResult.license.currentUsages / validationResult.license.maxUsages) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-6 text-lg font-semibold"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-500/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-3">
                      <XCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-red-400 mb-2">
                      Invalid Key
                    </h3>
                    <p className="text-gray-300">
                      This key is invalid, expired, or has reached its usage
                      limit
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setShowResult(false);
                      setValidationResult(null);
                      setLicenseCode("");
                    }}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 py-6 text-lg"
                  >
                    Try Another Key
                  </Button>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => {
                reset();
                onClose();
              }}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KeyValidator;
