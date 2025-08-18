import React from "react";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Construction, Wrench, Hammer, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface MaintenancePageProps {
  message: string;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ message }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <BackgroundAnimation />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm shadow-2xl shadow-red-500/20">
          <CardContent className="p-12">
            {/* Animated Icons */}
            <div className="relative mb-8">
              <div className="flex justify-center items-center space-x-4 mb-4">
                <Construction className="w-12 h-12 text-red-500 animate-bounce" />
                <Wrench className="w-10 h-10 text-red-400 animate-pulse" />
                <Hammer className="w-12 h-12 text-red-500 animate-bounce delay-150" />
              </div>

              {/* Neon glow effect */}
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
                Maintenance
              </span>
            </h1>

            {/* Message */}
            <div className="mb-8">
              <p className="text-xl text-gray-200 mb-4 leading-relaxed">
                {message}
              </p>
              <div className="flex justify-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping delay-75" />
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping delay-150" />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="mb-8 p-6 border border-red-500/30 rounded-lg bg-red-500/5">
              <p className="text-gray-300 text-sm">
                Our team is actively working to improve your experience. We'll
                be back very soon!
              </p>
            </div>

            {/* Admin access button */}
            <Link to="/admin">
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all duration-200"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Access
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Additional effects */}
        <div className="mt-8 opacity-60">
          <div className="flex justify-center space-x-8 text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-red-500/30 rounded-full mx-auto mb-2 animate-spin" />
              <p className="text-xs">Update</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-red-500/30 rounded-full mx-auto mb-2 animate-pulse" />
              <p className="text-xs">Optimization</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 border-2 border-red-500/30 rounded-full mx-auto mb-2 animate-bounce" />
              <p className="text-xs">Enhancement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
