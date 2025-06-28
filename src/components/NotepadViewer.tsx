import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, FileText, X, Terminal } from "lucide-react";
import { toast } from "sonner";

interface NotepadViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const NotepadViewer: React.FC<NotepadViewerProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Contenu copié dans le presse-papiers!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950/95 border-gray-800 max-w-4xl backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header terminal style */}
          <DialogHeader className="border-b border-gray-800 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-green-400" />
                  <DialogTitle className="text-green-400 font-mono text-lg">
                    {title}
                  </DialogTitle>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Terminal content */}
          <div className="relative bg-black/50 rounded-lg mt-4 min-h-[400px] border border-gray-800/50">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800/50 rounded-t-lg">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm font-mono">
                  content.txt
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 relative">
              {/* Terminal prompt */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-green-400 font-mono">➜</span>
                <span className="text-blue-400 font-mono">user</span>
                <span className="text-gray-400 font-mono">cat content.txt</span>
              </div>

              {/* Animated content */}
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative"
                  >
                    {/* Typing animation effect */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <pre className="whitespace-pre-wrap font-mono text-gray-100 leading-7 text-sm">
                        {content}
                      </pre>
                    </motion.div>

                    {/* Cursor */}
                    <motion.div
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="inline-block w-2 h-5 bg-green-400 ml-1"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Background grid effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-800">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="border-green-600/50 text-green-400 hover:bg-green-600/10 hover:border-green-500"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copier
            </Button>
            <Button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Fermer
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default NotepadViewer;
