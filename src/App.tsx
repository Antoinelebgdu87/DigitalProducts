import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import {
  MaintenanceProvider,
  useMaintenance,
} from "@/context/MaintenanceContext";
import { UserProvider } from "@/context/UserContext";
import { AdminModeProvider } from "@/context/AdminModeContext";
import { TranslationProvider } from "@/context/TranslationContext";
// Firebase toujours utilisé
import ModernHomePage from "./components/ModernHomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLimitedDashboard from "./pages/AdminLimitedDashboard";
import ShopDashboard from "./pages/ShopDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import MaintenancePage from "./pages/MaintenancePage";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import DevToolsProtection from "./components/DevToolsProtection";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <AdminLogin />;
};

// Main App Component with Maintenance Check
const AppContent = () => {
  try {
    const { isMaintenanceMode, maintenanceMessage, isLoading } =
      useMaintenance();
    const { isAuthenticated } = useAuth();

    // Show Firebase status
    React.useEffect(() => {
      console.log(
        "🔥 Firebase connecté - Synchronisation en temps réel active",
      );
    }, []);

    // Show loading state while maintenance context is initializing
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement....</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <DevToolsProtection />
        <Routes>
          <Route
            path="/"
            element={
              isMaintenanceMode && !isAuthenticated ? (
                <MaintenancePage message={maintenanceMessage} />
              ) : (
                <ModernHomePage />
              )
            }
          />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin-limited" element={<AdminLimitedDashboard />} />
          <Route path="/shop" element={<ShopDashboard />} />
          <Route path="/partner" element={<PartnerDashboard />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route
            path="*"
            element={
              isMaintenanceMode && !isAuthenticated ? (
                <MaintenancePage message={maintenanceMessage} />
              ) : (
                <NotFound />
              )
            }
          />
        </Routes>
      </>
    );
  } catch (error) {
    console.error("Error in AppContent:", error);
    // Fallback UI in case of context errors
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erreur de chargement</h1>
          <p className="text-muted-foreground mb-4">
            Une erreur s'est produite lors du chargement de l'application.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner
        position="top-right"
        toastOptions={{
          style: {
            marginTop: "20px",
            marginRight: "20px",
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <AdminModeProvider>
            <MaintenanceProvider>
              <UserProvider>
                <div className="dark min-h-screen bg-background text-foreground">
                  <AppContent />
                </div>
              </UserProvider>
            </MaintenanceProvider>
          </AdminModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
