import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Store,
  Crown,
  Shield,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const FloatingRoleBadge: React.FC = () => {
  const { currentUser } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);

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
        return "Admin";
      case "partner":
        return "Partner";
      case "shop_access":
        return "Shop";
      default:
        return "User";
    }
  };

  const getRoleColor = () => {
    switch (currentUser.role) {
      case "admin":
        return "from-red-500 to-red-600 border-red-400";
      case "partner":
        return "from-yellow-500 to-yellow-600 border-yellow-400";
      case "shop_access":
        return "from-purple-500 to-purple-600 border-purple-400";
      default:
        return "from-gray-500 to-gray-600 border-gray-400";
    }
  };

  const getRoleDescription = () => {
    switch (currentUser.role) {
      case "admin":
        return "Accès total administration";
      case "partner":
        return "Partenaire officiel vérifié";
      case "shop_access":
        return "Créateur de produits";
      default:
        return "Membre communauté";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Badge principal */}
        <motion.div
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            bg-gradient-to-r ${getRoleColor()} text-white
            rounded-full px-3 py-2 shadow-xl backdrop-blur-sm
            border border-white/20 cursor-pointer
            flex items-center space-x-2 text-sm font-medium
            transition-all duration-300 hover:shadow-2xl
          `}
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            {getRoleIcon()}
          </div>
          <span className="text-xs font-semibold">{getRoleLabel()}</span>
          {currentUser.role === "partner" && (
            <Sparkles className="w-3 h-3 animate-pulse" />
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp className="w-3 h-3" />
          </motion.div>
        </motion.div>

        {/* Panel étendu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-full right-0 mb-2 w-56"
            >
              <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {currentUser.username}
                    </p>
                    <p className="text-gray-400 text-xs">
                      #{currentUser.id.slice(-6)}
                    </p>
                  </div>
                </div>

                {/* Role badge */}
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    className={`
                      bg-gradient-to-r ${getRoleColor()} text-white border
                      text-xs px-2 py-1 rounded-full shadow-lg
                      ${currentUser.role === "partner" ? "animate-pulse" : ""}
                    `}
                  >
                    {getRoleIcon()}
                    <span className="ml-1">{getRoleLabel()}</span>
                    {currentUser.role === "partner" && (
                      <Sparkles className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-xs text-center">
                  {getRoleDescription()}
                </p>

                {/* Glow effect pour les rôles spéciaux */}
                {(currentUser.role === "admin" ||
                  currentUser.role === "partner") && (
                  <motion.div
                    className={`
                      absolute inset-0 rounded-2xl blur-xl -z-10 opacity-20
                      ${
                        currentUser.role === "admin"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }
                    `}
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow effect principal */}
        {(currentUser.role === "admin" || currentUser.role === "partner") && (
          <motion.div
            className={`
              absolute inset-0 rounded-full blur-lg -z-10
              ${
                currentUser.role === "admin"
                  ? "bg-red-500/30"
                  : "bg-yellow-500/30"
              }
            `}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default FloatingRoleBadge;
