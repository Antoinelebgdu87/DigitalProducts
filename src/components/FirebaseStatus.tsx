import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Cloud } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FirebaseStatus: React.FC = () => {
  const isOnline = true; // Firebase toujours utilisé

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
              className="border-green-500 text-green-400 bg-green-500/10 transition-all duration-300"
            >
              <Cloud className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">Mode en ligne</p>
            <p className="text-xs text-gray-400 mt-1">
              Synchronisation Firebase active
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FirebaseStatus;
