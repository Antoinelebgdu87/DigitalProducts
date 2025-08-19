import React from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Store, 
  Crown, 
  Shield, 
  Sparkles 
} from "lucide-react";

const UserRoleBadge: React.FC = () => {
  const { currentUser } = useUser();

  if (!currentUser) {
    return null;
  }

  const getRoleIcon = () => {
    switch (currentUser.role) {
      case "admin":
        return <Shield className="w-3 h-3" />;
      case "partner":
        return <Crown className="w-3 h-3" />;
      case "shop_access":
        return <Store className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getRoleLabel = () => {
    switch (currentUser.role) {
      case "admin":
        return "Administrateur";
      case "partner":
        return "Partenaire";
      case "shop_access":
        return "Boutique";
      default:
        return "Membre";
    }
  };

  const getRoleColor = () => {
    switch (currentUser.role) {
      case "admin":
        return "bg-red-600 text-white border-red-500";
      case "partner":
        return "bg-yellow-600 text-white border-yellow-500";
      case "shop_access":
        return "bg-purple-600 text-white border-purple-500";
      default:
        return "bg-gray-600 text-white border-gray-500";
    }
  };

  const getRoleDescription = () => {
    switch (currentUser.role) {
      case "admin":
        return "Accès complet à la gestion";
      case "partner":
        return "Partenaire officiel vérifié";
      case "shop_access":
        return "Peut créer des produits";
      default:
        return "Accès standard";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center space-y-2"
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{currentUser.username}</p>
            <p className="text-gray-400 text-xs">#{currentUser.id.slice(-6)}</p>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Badge
            className={`
              ${getRoleColor()}
              transition-all duration-300 hover:shadow-lg
              ${currentUser.role === "partner" ? "animate-pulse" : ""}
            `}
          >
            {getRoleIcon()}
            <span className="ml-1">{getRoleLabel()}</span>
            {currentUser.role === "partner" && (
              <Sparkles className="w-3 h-3 ml-1" />
            )}
          </Badge>
        </motion.div>
      </div>
      
      <p className="text-xs text-gray-400 text-center">
        {getRoleDescription()}
      </p>
    </motion.div>
  );
};

export default UserRoleBadge;
