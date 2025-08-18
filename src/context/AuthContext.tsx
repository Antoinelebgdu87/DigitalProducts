import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminCredentials } from "@/types";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a unique session ID for this browser session
const getSessionId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const ADMIN_CREDENTIALS: AdminCredentials = {
  username: "Admin",
  password: "Antoine80@",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionId] = useState<string>(getSessionId());

  useEffect(() => {
    // Check if this session is authenticated in Firebase
    const checkAuthStatus = async () => {
      try {
        const sessionDocRef = doc(db, "admin_sessions", sessionId);
        
        // Listen to real-time changes
        const unsubscribe = onSnapshot(sessionDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            const isValid = data.isAuthenticated && 
                           data.expiresAt && 
                           new Date(data.expiresAt.toDate()) > new Date();
            
            setIsAuthenticated(isValid);
            
            if (!isValid && doc.exists()) {
              // Clean up expired session
              setDoc(sessionDocRef, { isAuthenticated: false });
            }
          } else {
            setIsAuthenticated(false);
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setIsAuthenticated(false);
      }
    };

    const unsubscribe = checkAuthStatus();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [sessionId]);

  const login = (username: string, password: string): boolean => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      // Save authentication to Firebase with expiration (24 hours)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const sessionDocRef = doc(db, "admin_sessions", sessionId);
      setDoc(sessionDocRef, {
        isAuthenticated: true,
        loginTime: new Date(),
        expiresAt: expiresAt,
        userAgent: navigator.userAgent
      }).then(() => {
        setIsAuthenticated(true);
        console.log("🔑 Admin connecté et session sauvegardée dans Firebase");
      }).catch((error) => {
        console.error("Erreur lors de la sauvegarde de la session:", error);
      });
      
      return true;
    }
    return false;
  };

  const logout = () => {
    // Remove authentication from Firebase
    const sessionDocRef = doc(db, "admin_sessions", sessionId);
    setDoc(sessionDocRef, {
      isAuthenticated: false,
      logoutTime: new Date()
    }).then(() => {
      setIsAuthenticated(false);
      console.log("🔑 Admin déconnecté et session supprimée de Firebase");
    }).catch((error) => {
      console.error("Erreur lors de la suppression de la session:", error);
      setIsAuthenticated(false);
    });
  };

  // Clean up session on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        // Mark session as potentially expired (but don't fully logout)
        const sessionDocRef = doc(db, "admin_sessions", sessionId);
        setDoc(sessionDocRef, {
          isAuthenticated: true,
          lastSeen: new Date()
        }, { merge: true }).catch(console.error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAuthenticated, sessionId]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
