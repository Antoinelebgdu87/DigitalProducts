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
import { ModernHomePage } from "./components/ModernHomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { MaintenancePage } from "./pages/MaintenancePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <AdminLogin />;
};

// Main App Component with Maintenance Check
const AppContent = () => {
  const { isMaintenanceMode, maintenanceMessage } = useMaintenance();
  const { isAuthenticated } = useAuth();

  return (
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
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="bottom-right" />
      <BrowserRouter>
        <AuthProvider>
          <MaintenanceProvider>
            <UserProvider>
              <div className="dark min-h-screen bg-background text-foreground">
                <AppContent />
              </div>
            </UserProvider>
          </MaintenanceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
