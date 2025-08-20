import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HelpCircle,
  Crown,
  Store,
  Shield,
  Package,
  Download,
  Euro,
  Sparkles,
  ArrowRight,
  Users,
  Zap,
  Star,
  Globe,
  Heart,
} from "lucide-react";

interface HelpGuideProps {
  variant?: "floating" | "inline";
  userRole?: string;
}

const HelpGuide: React.FC<HelpGuideProps> = ({ 
  variant = "floating",
  userRole = "user"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getRoleInfo = () => {
    switch (userRole) {
      case "admin":
        return {
          icon: <Shield className="w-5 h-5 text-red-400" />,
          title: "Administrateur",
          description: "Accès complet à toutes les fonctionnalités",
          color: "bg-red-500/20 border-red-500/30",
          actions: [
            "Gérer tous les utilisateurs",
            "Modérer les produits",
            "Configurer la plateforme",
            "Accéder aux analytics",
          ]
        };
      case "partner":
        return {
          icon: <Crown className="w-5 h-5 text-yellow-400" />,
          title: "Partenaire Officiel",
          description: "Privilèges exclusifs pour créer du contenu premium",
          color: "bg-yellow-500/20 border-yellow-500/30",
          actions: [
            "Créer des produits exclusifs",
            "Accès aux outils avancés",
            "Analytics détaillées",
            "Support prioritaire",
          ]
        };
      case "shop_access":
        return {
          icon: <Store className="w-5 h-5 text-purple-400" />,
          title: "Accès Boutique",
          description: "Permission de créer et vendre des produits",
          color: "bg-purple-500/20 border-purple-500/30",
          actions: [
            "Créer des produits",
            "Gérer votre boutique",
            "Suivre les ventes",
            "Interagir avec clients",
          ]
        };
      default:
        return {
          icon: <Users className="w-5 h-5 text-blue-400" />,
          title: "Utilisateur",
          description: "Accès aux produits et téléchargements",
          color: "bg-blue-500/20 border-blue-500/30",
          actions: [
            "Parcourir les produits",
            "Télécharger du contenu",
            "Participer à la communauté",
            "Découvrir des créateurs",
          ]
        };
    }
  };

  const generalTips = [
    {
      icon: <Globe className="w-4 h-4 text-green-400" />,
      title: "Traduction",
      tip: "Changez la langue avec le bouton globe (🌍) - Français, English, Português"
    },
    {
      icon: <Download className="w-4 h-4 text-blue-400" />,
      title: "Téléchargements", 
      tip: "Accès instantané - pas d'inscription requise"
    },
    {
      icon: <Heart className="w-4 h-4 text-red-400" />,
      title: "Communauté",
      tip: "Respectez les autres utilisateurs et les règles"
    },
    {
      icon: <Star className="w-4 h-4 text-yellow-400" />,
      title: "Qualité",
      tip: "Tous les produits sont vérifiés pour garantir la qualité"
    }
  ];

  const roleInfo = getRoleInfo();

  const HelpContent = () => (
    <div className="space-y-6">
      {/* Role Information */}
      <Card className={`border ${roleInfo.color} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            {roleInfo.icon}
            <span>Votre Rôle: {roleInfo.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">{roleInfo.description}</p>
          <div className="space-y-2">
            <h4 className="text-white font-medium">Ce que vous pouvez faire:</h4>
            <ul className="space-y-1">
              {roleInfo.actions.map((action, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-300 text-sm">
                  <ArrowRight className="w-3 h-3 text-green-400" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* General Tips */}
      <Card className="border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Conseils d'Utilisation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {generalTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                <div className="p-1">
                  {tip.icon}
                </div>
                <div>
                  <h5 className="text-white font-medium text-sm">{tip.title}</h5>
                  <p className="text-gray-400 text-xs">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Info */}
      <Card className="border-gray-800/50 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span>À Propos de DigitalHub</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Plateforme de produits numériques premium</span>
            </div>
            <div className="flex items-center space-x-2">
              <Euro className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Modèle freemium - gratuit et payant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-gray-300">Sécurisé et fiable</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">Multilingue - 6 langues supportées</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (variant === "floating") {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full p-3"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900/95 backdrop-blur-md border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              <span>Guide d'Utilisation</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Découvrez comment utiliser DigitalHub et maximiser votre expérience
            </DialogDescription>
          </DialogHeader>
          <HelpContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6">
      <HelpContent />
    </div>
  );
};

export default HelpGuide;
