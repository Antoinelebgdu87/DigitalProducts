import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, FileText, X } from "lucide-react";
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
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Contenu copié dans le presse-papiers!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-yellow-50 border-yellow-200 max-w-2xl">
        {/* Header avec style bloc-notes */}
        <DialogHeader className="border-b border-yellow-300 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-yellow-700" />
              <DialogTitle className="text-yellow-800 font-mono">
                {title}
              </DialogTitle>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-yellow-700 hover:bg-yellow-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Contenu du bloc-notes */}
        <div className="relative">
          {/* Lignes de bloc-notes */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="border-b border-blue-200 opacity-30"
                style={{ height: "24px" }}
              />
            ))}
          </div>

          {/* Marge rouge */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8 bg-red-200 opacity-50 pointer-events-none"
            style={{
              borderRight: "2px solid #dc2626",
            }}
          />

          {/* Contenu */}
          <div className="relative z-10 p-6 pl-12">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-6">
              {content}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-yellow-300">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copier
          </Button>
          <Button
            onClick={onClose}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotepadViewer;
