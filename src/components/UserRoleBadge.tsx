import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Store, Crown, Shield, Sparkles } from "lucide-react";
import ProfileModal from "./ProfileModal";

const UserRoleBadge: React.FC = () => {
  const { currentUser } = useUser();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
        return "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400";
      case "partner":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-400";
      case "shop_access":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400";
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {/* Avatar cliquable avec vraie photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          onClick={() => setIsProfileModalOpen(true)}
        >
          <Avatar className="w-6 h-6 ring-2 ring-white/20">
            <AvatarImage
              src={currentUser.avatarUrl}
              alt={currentUser.username}
            />
            <AvatarFallback className="bg-gradient-to-br from-red-500 to-red-700 text-white text-xs">
              <User className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
        </motion.div>

        {/* Username compact */}
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-white text-xs font-medium max-w-20 truncate"
        >
          {currentUser.username}
        </motion.span>

        {/* Role badge compact et joli */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <Badge
            className={`
            ${getRoleColor()}
            text-xs px-2 py-0.5 rounded-full shadow-lg border
            transition-all duration-300 hover:shadow-xl
            ${currentUser.role === "partner" ? "animate-pulse" : ""}
          `}
          >
            {getRoleIcon()}
            <span className="ml-1 font-medium">{getRoleLabel()}</span>
            {currentUser.role === "partner" && (
              <Sparkles className="w-2.5 h-2.5 ml-1 animate-pulse" />
            )}
          </Badge>

          {/* Glow effect pour les rôles spéciaux */}
          {(currentUser.role === "admin" || currentUser.role === "partner") && (
            <motion.div
              className={`
              absolute inset-0 rounded-full blur-sm -z-10
              ${
                currentUser.role === "admin"
                  ? "bg-red-500/30"
                  : "bg-yellow-500/30"
              }
            `}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Modal de personnalisation */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default UserRoleBadge;
