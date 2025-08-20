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
// Firebase avec fallback pour éviter l'écran noir
import { initializeFirebaseWithFallback, getFirebaseStatus } from "@/lib/firebase-fallback";
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
import { useAutoTranslate } from "./hooks/useAutoTranslate";
import FirebaseConnectionStatus from "./components/FirebaseConnectionStatus";

// État global pour Firebase
let firebaseInitialized = false;
let firebaseInitPromise: Promise<any> | null = null;

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <AdminLogin />;
};

// Main App Component with Maintenance Check
const AppContent = () => {
  const [isAppReady, setIsAppReady] = React.useState(false);
  const [firebaseError, setFirebaseError] = React.useState<string | null>(null);
  const [isFirebaseHealthy, setIsFirebaseHealthy] = React.useState(false);

  try {
    const { isMaintenanceMode, maintenanceMessage, isLoading } =
      useMaintenance();
    const { isAuthenticated } = useAuth();

    // Activer la traduction automatique
    useAutoTranslate();

    // Initialiser Firebase de manière sécurisée
    React.useEffect(() => {
      const initFirebase = async () => {
        try {
          if (!firebaseInitialized) {
            console.log("🚀 Initialisation de Firebase...");

            if (!firebaseInitPromise) {
              firebaseInitPromise = initializeFirebaseWithFallback();
            }

            const result = await firebaseInitPromise;

            if (result.isConnected) {
              console.log("✅ Firebase connecté - Synchronisation en temps réel active");
              setIsFirebaseHealthy(true);
              setFirebaseError(null);
            } else {
              console.log("⚠️ Firebase non disponible - Mode dégradé activé");
              setIsFirebaseHealthy(false);
              setFirebaseError("Firebase non disponible - Mode hors ligne");
            }

            firebaseInitialized = true;
          } else {
            // Vérifier le statut existant
            const status = getFirebaseStatus();
            setIsFirebaseHealthy(status.isConnected);
            if (!status.isConnected) {
              setFirebaseError("Firebase non disponible - Mode hors ligne");
            }
          }
        } catch (error: any) {
          console.error("❌ Erreur d'initialisation Firebase:", error);
          setFirebaseError(`Erreur Firebase: ${error.message}`);
          setIsFirebaseHealthy(false);
        } finally {
          setIsAppReady(true);
        }
      };

      initFirebase();
    }, []);

    // Show loading state while app is initializing (Firebase + maintenance)
    if (isLoading || !isAppReady) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <div>
              <p className="text-lg font-medium">Chargement de l'application...</p>
              {!isAppReady && (
                <p className="text-sm text-muted-foreground mt-2">
                  Connexion aux services...
                </p>
              )}
            </div>
            {firebaseError && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <p className="text-yellow-300 text-sm">
                  ⚠️ {firebaseError}
                </p>
                <p className="text-yellow-400/80 text-xs mt-1">
                  L'application continuera de fonctionner avec des fonctionnalités limitées.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        <DevToolsProtection />
        <FirebaseConnectionStatus />
        {/* Affichage du statut Firebase pour l'admin */}
        {firebaseError && isAuthenticated && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-600/90 text-white px-4 py-2 text-center text-sm">
            🔥 {firebaseError} - Certaines fonctionnalités peuvent être limitées
          </div>
        )}
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
  } catch (error: any) {
    console.error("❌ Erreur critique dans AppContent:", error);

    // Fallback UI robuste en cas d'erreur critique
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Erreur de chargement</h1>
            <p className="text-gray-300 mb-4">
              Une erreur inattendue s'est produite. L'application ne peut pas démarrer correctement.
            </p>

            {/* Détails de l'erreur pour le debug */}
            <details className="text-left bg-gray-800 rounded p-3 mb-4 text-sm">
              <summary className="cursor-pointer text-red-400 mb-2">Détails techniques</summary>
              <code className="text-gray-300">
                {error?.message || 'Erreur inconnue'}
              </code>
            </details>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              🔄 Recharger la page
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              🧹 Effacer les données et recharger
            </button>

            <a
              href="/"
              className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-center"
            >
              🏠 Retour à l'accueil
            </a>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Si le problème persiste, contactez le support technique.
          </p>
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
                <TranslationProvider>
                  <div className="dark min-h-screen bg-background text-foreground">
                    <AppContent />
                  </div>
                </TranslationProvider>
              </UserProvider>
            </MaintenanceProvider>
          </AdminModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
