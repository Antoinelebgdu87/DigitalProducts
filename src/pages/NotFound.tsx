import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import BackgroundAnimation from "@/components/BackgroundAnimation";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <BackgroundAnimation />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm shadow-2xl shadow-red-500/20">
          <CardContent className="p-12">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
                404
              </span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Page introuvable
            </h2>

            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>

            {/* Action Button */}
            <Link to="/">
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/50">
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>

            {/* Decorative elements */}
            <div className="mt-12 grid grid-cols-3 gap-4 opacity-30">
              <div className="h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded" />
              <div className="h-2 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded" />
              <div className="h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
