import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Crown,
  Shield,
  Store,
  User,
  Sparkles,
} from "lucide-react";

const RoleUpdateNotification: React.FC = () => {
  const { currentUser } = useUser();
  const [showNotification, setShowNotification] = useState(false);
  const [previousRole, setPreviousRole] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.role) {
      const lastRole = localStorage.getItem("lastUserRole");

      if (lastRole && lastRole !== currentUser.role) {
        // Role changed!
        setPreviousRole(lastRole);
        setShowNotification(true);

        // Auto hide after 4 seconds
        const timer = setTimeout(() => {
          setShowNotification(false);
        }, 4000);

        return () => clearTimeout(timer);
      }

      // Save current role
      localStorage.setItem("lastUserRole", currentUser.role);
    }
  }, [currentUser?.role]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "partner":
        return <Crown className="w-4 h-4" />;
      case "shop_access":
        return <Store className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "border-red-500 text-red-400 bg-red-500/20";
      case "partner":
        return "border-yellow-500 text-yellow-400 bg-yellow-500/20";
      case "shop_access":
        return "border-purple-500 text-purple-400 bg-purple-500/20";
      default:
        return "border-gray-500 text-gray-400 bg-gray-500/20";
    }
  };

  if (!currentUser || !showNotification) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 0.5,
        }}
        className="fixed bottom-24 right-4 z-50 max-w-sm"
      >
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
              className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 text-white" />
            </motion.div>

            <div className="flex-1">
              <p className="text-white font-medium text-sm">
                Rôle mis à jour !
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {previousRole && (
                  <>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getRoleColor(previousRole)}`}
                    >
                      {getRoleIcon(previousRole)}
                      <span className="ml-1">{getRoleLabel(previousRole)}</span>
                    </Badge>
                    <span className="text-gray-400 text-xs">→</span>
                  </>
                )}
                <Badge
                  variant="outline"
                  className={`text-xs ${getRoleColor(currentUser.role)}`}
                >
                  {getRoleIcon(currentUser.role)}
                  <span className="ml-1">{getRoleLabel(currentUser.role)}</span>
                  {currentUser.role === "partner" && (
                    <Sparkles className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              </div>
            </div>

            <button
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RoleUpdateNotification;
