import React from "react";
import { motion } from "framer-motion";
import { shouldUseFirebase } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudOff, Wifi, WifiOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FirebaseStatus: React.FC = () => {
  const isOnline = shouldUseFirebase();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Badge
              variant="outline"
              className={`
                ${isOnline 
                  ? "border-green-500 text-green-400 bg-green-500/10" 
                  : "border-orange-500 text-orange-400 bg-orange-500/10"
                }
                transition-all duration-300
              `}
            >
              {isOnline ? (
                <>
                  <Cloud className="w-3 h-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <CloudOff className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">
              {isOnline ? "Mode en ligne" : "Mode hors ligne"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {isOnline 
                ? "Synchronisation Firebase active" 
                : "Stockage local uniquement"
              }
            </p>
            {!isOnline && (
              <p className="text-xs text-orange-400 mt-1">
                Configurez Firebase pour la synchronisation
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FirebaseStatus;
