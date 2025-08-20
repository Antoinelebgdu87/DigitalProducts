import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileText,
  Link as LinkIcon,
  Package,
  Sparkles,
  Crown,
  Store,
} from "lucide-react";

interface ProductFormData {
  title: string;
  description: string;
  imageUrl: string;
  downloadUrl: string;
  type: "free" | "paid";
  actionType: "download" | "discord";
  contentType: "link" | "text";
  content: string;
  discordUrl: string;
  price: number;
  lives: number;
}

interface ProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  title: string;
  description: string;
  submitButtonText: string;
  submitButtonClass?: string;
  icon?: React.ReactNode;
  isEdit?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  formData,
  setFormData,
  title,
  description,
  submitButtonText,
  submitButtonClass = "bg-purple-600 hover:bg-purple-700",
  icon = <Package className="w-5 h-5" />,
  isEdit = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-700/50 max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        
        <DialogHeader className="relative">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30">
              {icon}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {title}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                {description}
              </DialogDescription>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 relative">
          {/* En-tête du formulaire */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${isEdit ? 'edit-' : ''}title`} className="text-white font-medium flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Titre</span>
              </Label>
              <Input
                id={`${isEdit ? 'edit-' : ''}title`}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-gray-800/50 border-gray-600/50 text-white focus:border-purple-500/50 focus:ring-purple-500/20 transition-all backdrop-blur-sm"
                placeholder="Nom de votre produit..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${isEdit ? 'edit-' : ''}type`} className="text-white font-medium">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: "free" | "paid") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-600/50 text-white focus:border-purple-500/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="free" className="text-white hover:bg-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Gratuit</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="paid" className="text-white hover:bg-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span>Payant</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${isEdit ? 'edit-' : ''}actionType`} className="text-white font-medium">
                Action principale
              </Label>
              <Select
                value={formData.actionType}
                onValueChange={(value: "download" | "discord") =>
                  setFormData({ ...formData, actionType: value })
                }
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-600/50 text-white focus:border-purple-500/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="download" className="text-white hover:bg-gray-700">
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4 text-blue-400" />
                      <span>Téléchargement</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="discord" className="text-white hover:bg-gray-700">
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="w-4 h-4 text-purple-400" />
                      <span>Discord</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prix et vies pour produits payants */}
          {formData.type === "paid" && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium mb-3 flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span>Configuration Produit Payant</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${isEdit ? 'edit-' : ''}price`} className="text-white font-medium">
                    Prix (€)
                  </Label>
                  <Input
                    id={`${isEdit ? 'edit-' : ''}price`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-gray-800/50 border-gray-600/50 text-white focus:border-yellow-500/50"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${isEdit ? 'edit-' : ''}lives`} className="text-white font-medium">
                    Nombre de vies
                  </Label>
                  <Select
                    value={formData.lives.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, lives: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="bg-gray-800/50 border-gray-600/50 text-white focus:border-yellow-500/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {[1, 3, 5, 10, 25, 50, 100, 999].map((num) => (
                        <SelectItem key={num} value={num.toString()} className="text-white hover:bg-gray-700">
                          {num === 999 ? "Illimité (999)" : `${num} vie${num > 1 ? 's' : ''}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor={`${isEdit ? 'edit-' : ''}description`} className="text-white font-medium">
              Description
            </Label>
            <Textarea
              id={`${isEdit ? 'edit-' : ''}description`}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-gray-800/50 border-gray-600/50 text-white focus:border-purple-500/50 focus:ring-purple-500/20 transition-all resize-none"
              rows={3}
              placeholder="Décrivez votre produit de manière attrayante..."
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor={`${isEdit ? 'edit-' : ''}imageUrl`} className="text-white font-medium">
              URL de l'image
            </Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}imageUrl`}
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="bg-gray-800/50 border-gray-600/50 text-white focus:border-purple-500/50"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Configuration du contenu selon le type d'action */}
          {formData.actionType === "download" && (
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4 space-y-4">
              <h4 className="text-blue-400 font-medium flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Configuration Téléchargement</span>
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor={`${isEdit ? 'edit-' : ''}contentType`} className="text-white font-medium">
                  Type de contenu
                </Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value: "link" | "text") =>
                    setFormData({ ...formData, contentType: value })
                  }
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-600/50 text-white focus:border-blue-500/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="link" className="text-white hover:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="w-4 h-4 text-blue-400" />
                        <span>Lien de téléchargement</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="text" className="text-white hover:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-green-400" />
                        <span>Contenu texte (bloc-notes)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.contentType === "link" ? (
                <div className="space-y-2">
                  <Label htmlFor={`${isEdit ? 'edit-' : ''}downloadUrl`} className="text-white font-medium">
                    URL de téléchargement
                  </Label>
                  <Input
                    id={`${isEdit ? 'edit-' : ''}downloadUrl`}
                    value={formData.downloadUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, downloadUrl: e.target.value })
                    }
                    className="bg-gray-800/50 border-gray-600/50 text-white focus:border-blue-500/50"
                    placeholder="https://example.com/download"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor={`${isEdit ? 'edit-' : ''}content`} className="text-white font-medium">
                    Contenu du bloc-notes
                  </Label>
                  <Textarea
                    id={`${isEdit ? 'edit-' : ''}content`}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="bg-gray-800/50 border-gray-600/50 text-white focus:border-blue-500/50 resize-none"
                    rows={8}
                    placeholder="Entrez le contenu qui sera affiché dans le bloc-notes..."
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* Discord URL */}
          <div className="space-y-4">
            {formData.actionType === "discord" && (
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="text-purple-400 font-medium mb-3 flex items-center space-x-2">
                  <LinkIcon className="w-4 h-4" />
                  <span>Configuration Discord</span>
                </h4>
                <div className="space-y-2">
                  <Label htmlFor={`${isEdit ? 'edit-' : ''}discordUrlRequired`} className="text-white font-medium">
                    Discord Server URL <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id={`${isEdit ? 'edit-' : ''}discordUrlRequired`}
                    value={formData.discordUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, discordUrl: e.target.value })
                    }
                    className="bg-gray-800/50 border-gray-600/50 text-white focus:border-purple-500/50"
                    placeholder="https://discord.gg/example"
                    required
                  />
                </div>
              </div>
            )}

            {formData.actionType === "download" && (
              <div className="space-y-2">
                <Label htmlFor={`${isEdit ? 'edit-' : ''}discordUrl`} className="text-white font-medium">
                  Discord Server URL <span className="text-gray-500">(optionnel)</span>
                </Label>
                <Input
                  id={`${isEdit ? 'edit-' : ''}discordUrl`}
                  value={formData.discordUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, discordUrl: e.target.value })
                  }
                  className="bg-gray-800/50 border-gray-600/50 text-white focus:border-purple-500/50"
                  placeholder="https://discord.gg/example"
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className={`${submitButtonClass} shadow-lg hover:shadow-xl transition-all duration-200 font-medium flex items-center space-x-2`}
            >
              <span>{submitButtonText}</span>
              <Sparkles className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
