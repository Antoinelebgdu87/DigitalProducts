import React, { useState, useEffect } from "react";
import { ModernProductCard } from "./ModernProductCard";
import { UsernameModal } from "./UsernameModal";
import { BanModal } from "./BanModal";
import { WarningModal } from "./WarningModal";
import { useProducts } from "@/hooks/useProducts";
import { useUser } from "@/context/UserContext";
import { useMaintenance } from "@/context/MaintenanceContext";
import { MaintenancePage } from "@/pages/MaintenancePage";
import { ModernBackground } from "./ModernBackground";

export const ModernHomePage: React.FC = () => {
  const { products, isLoading } = useProducts();
  const { currentUser, markWarningsAsRead } = useUser();
  const { isMaintenanceMode } = useMaintenance();
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    // Show username modal only if no current user exists
    if (!currentUser) {
      setShowUsernameModal(true);
    } else {
      setShowUsernameModal(false);
    }
  }, [currentUser]);

  // Show maintenance page if maintenance mode is active
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  // Show ban modal if user is banned
  if (currentUser?.isBanned) {
    return <BanModal isOpen={true} reason={currentUser.banReason || "No reason specified"} />;
  }

  // Show warning modal if user has unread warnings
  if (currentUser?.warnings?.some((w) => !w.isRead)) {
    return <WarningModal
      isOpen={true}
      warnings={currentUser.warnings}
      onClose={() => {
        // Mark warnings as read when modal is closed
        if (currentUser?.id) {
          markWarningsAsRead(currentUser.id);
        }
      }}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      <ModernBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 pt-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Key System
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Premium Software Solutions
            </p>
            {currentUser && (
              <div className="flex items-center justify-center space-x-2 text-lg">
                <span className="text-gray-400">Welcome back,</span>
                <span className="text-blue-400 font-semibold">
                  {currentUser.username}
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Available Products
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ModernProductCard
                    key={product.id}
                    product={product}
                    user={currentUser}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold mb-2">No Products Available</h3>
                <p className="text-gray-400">
                  New products will appear here when they're added.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center py-12 border-t border-gray-800">
            <p className="text-gray-400">
              © 2024 Key System. All rights reserved.
            </p>
          </footer>
        </div>
      </div>

      {/* Username Modal */}
      {showUsernameModal && (
        <UsernameModal onClose={() => setShowUsernameModal(false)} />
      )}
    </div>
  );
};
