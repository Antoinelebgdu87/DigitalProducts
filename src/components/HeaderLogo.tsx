import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useAdminMode } from "@/context/AdminModeContext";
import { 
  Shield, 
  Store, 
  Crown, 
  Star,
  Users,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderLogoProps {
  className?: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ className }) => {
  const { isAuthenticated, userRole, username, isAdmin, canAccessShop, isPartner } = useAuth();
  const { adminMode, setShopMode } = useAdminMode();

  const getLogoIcon = () => {
    if (!isAuthenticated) {
      return <Store className="w-8 h-8 text-red-500" />;
    }

    if (isAdmin()) {
      return adminMode.isShopMode ? (
        <Store className="w-8 h-8 text-purple-500" />
      ) : (
        <Shield className="w-8 h-8 text-red-500" />
      );
    }

    if (isPartner()) {
      return <Crown className="w-8 h-8 text-yellow-500" />;
    }

    if (canAccessShop()) {
      return <Store className="w-8 h-8 text-blue-500" />;
    }

    return <Users className="w-8 h-8 text-gray-500" />;
  };

  const getLogoText = () => {
    if (!isAuthenticated) {
      return {
        main: "Justement Usivant",
        sub: "Boutique Premium"
      };
    }

    if (isAdmin()) {
      return adminMode.isShopMode ? {
        main: "Justement Usivant",
        sub: "Mode Boutique"
      } : {
        main: "Admin Panel",
        sub: "Gestion & Modération"
      };
    }

    if (isPartner()) {
      return {
        main: "Justement Usivant",
        sub: "Partenaire Officiel"
      };
    }

    if (canAccessShop()) {
      return {
        main: "Justement Usivant",
        sub: "Accès Boutique"
      };
    }

    return {
      main: "Justement Usivant",
      sub: "Communauté"
    };
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "admin":
        return adminMode.isShopMode ? "text-purple-400" : "text-red-400";
      case "partner":
        return "text-yellow-400";
      case "shop_access":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const logoInfo = getLogoText();

  return (
    <TooltipProvider>
      <div className={`flex items-center space-x-4 ${className}`}>
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {getLogoIcon()}
          
          {/* Mode indicator for admins */}
          {isAdmin() && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              animate={{
                backgroundColor: adminMode.isShopMode ? "#a855f7" : "#ef4444",
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        <div className="flex flex-col">
          <motion.h1 
            className="text-xl font-bold text-white"
            key={logoInfo.main} // Force re-render on text change
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {logoInfo.main}
          </motion.h1>
          <motion.p 
            className={`text-sm ${getRoleColor()}`}
            key={logoInfo.sub} // Force re-render on text change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {logoInfo.sub}
          </motion.p>
        </div>

        {/* Role badge */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className={`${getRoleColor()} border-current`}
            >
              {userRole === "admin" && adminMode.isShopMode && (
                <>
                  <Store className="w-3 h-3 mr-1" />
                  Boutique
                </>
              )}
              {userRole === "admin" && !adminMode.isShopMode && (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </>
              )}
              {userRole === "partner" && (
                <>
                  <Crown className="w-3 h-3 mr-1" />
                  Partner
                </>
              )}
              {userRole === "shop_access" && (
                <>
                  <Store className="w-3 h-3 mr-1" />
                  Boutique
                </>
              )}
              {userRole === "user" && (
                <>
                  <Users className="w-3 h-3 mr-1" />
                  Membre
                </>
              )}
            </Badge>
          </motion.div>
        )}

        {/* Mode switcher for admins */}
        {isAdmin() && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShopMode(!adminMode.isShopMode)}
                className={`
                  border-gray-600 hover:border-gray-500 transition-all duration-300
                  ${adminMode.isShopMode 
                    ? "bg-purple-500/20 border-purple-500 text-purple-400" 
                    : "bg-red-500/20 border-red-500 text-red-400"
                  }
                `}
              >
                {adminMode.isShopMode ? (
                  <Store className="w-4 h-4" />
                ) : (
                  <Settings className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {adminMode.isShopMode 
                  ? "Passer en mode Admin" 
                  : "Passer en mode Boutique"
                }
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default HeaderLogo;
