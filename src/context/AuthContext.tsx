import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminCredentials, UserRole } from "@/types";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  userId: string;
  username: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
  canAccessShop: () => boolean;
  isPartner: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS: AdminCredentials = {
  username: "Admin",
  password: "Antoine80@",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const authStatus = localStorage.getItem("admin_authenticated");
    const savedRole = localStorage.getItem("user_role") as UserRole;
    const savedUserId = localStorage.getItem("user_id");
    const savedUsername = localStorage.getItem("username");

    if (authStatus === "true" && savedRole && savedUserId && savedUsername) {
      setIsAuthenticated(true);
      setUserRole(savedRole);
      setUserId(savedUserId);
      setUsername(savedUsername);
    }

    // Return empty cleanup function to prevent unsubscribe errors
    return () => {
      // No cleanup needed for localStorage
    };
  }, []);

  const login = (username: string, password: string): boolean => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminId = "admin-001";
      setIsAuthenticated(true);
      setUserRole("admin");
      setUserId(adminId);
      setUsername(username);

      localStorage.setItem("admin_authenticated", "true");
      localStorage.setItem("user_role", "admin");
      localStorage.setItem("user_id", adminId);
      localStorage.setItem("username", username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole("user");
    setUserId("");
    setUsername("");

    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
  };

  const isAdmin = (): boolean => userRole === "admin";
  const canAccessShop = (): boolean =>
    ["admin", "shop_access", "partner"].includes(userRole);
  const isPartner = (): boolean => userRole === "partner";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userId,
        username,
        login,
        logout,
        isAdmin,
        canAccessShop,
        isPartner,
      }}
    >
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
