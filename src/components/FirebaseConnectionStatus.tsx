import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { FirebaseService } from "@/lib/firebase-service";
import FirebaseFallback from "@/lib/firebase-fallback";

const FirebaseConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await FirebaseService.checkConnection();
      setIsOnline(connected);
      setLastCheck(new Date());
    } catch (error) {
      console.error("Error checking Firebase connection:", error);
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Vérifier la connexion au montage
    checkConnection();

    // Vérifier périodiquement la connexion
    const interval = setInterval(checkConnection, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Ne pas afficher si tout va bien
  if (isOnline && !isChecking) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
      <Alert
        className={`border-2 ${isOnline ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-orange-500 bg-orange-50 dark:bg-orange-950"}`}
      >
        <div className="flex items-center gap-3">
          {isChecking ? (
            <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
          ) : isOnline ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                {isChecking
                  ? "Vérification..."
                  : isOnline
                    ? "Connexion rétablie"
                    : "Mode déconnecté"}
              </span>
              <Badge
                variant={isOnline ? "default" : "destructive"}
                className="text-xs"
              >
                {isOnline ? (
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    En ligne
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <WifiOff className="h-3 w-3" />
                    Hors ligne
                  </div>
                )}
              </Badge>
            </div>

            <AlertDescription className="text-xs">
              {isChecking
                ? "Vérification de la connexion Firebase..."
                : isOnline
                  ? "La connexion à Firebase a été rétablie."
                  : "Utilisation des données en cache. Certaines fonctionnalités peuvent être limitées."}
            </AlertDescription>
          </div>

          {!isChecking && (
            <Button
              size="sm"
              variant="outline"
              onClick={checkConnection}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </div>

        {lastCheck && (
          <div className="text-xs text-muted-foreground mt-2">
            Dernière vérification : {lastCheck.toLocaleTimeString()}
          </div>
        )}
      </Alert>
    </div>
  );
};

export default FirebaseConnectionStatus;
