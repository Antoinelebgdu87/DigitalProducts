import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db, shouldUseFirebase } from "@/lib/firebase";

export type UserRole = "user" | "shop_access" | "partner" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  isOnline: boolean;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: Date;
  banExpiresAt?: Date | null;
  warnings: Warning[];
  createdAt: Date;
  lastSeen: Date;
}

export interface Warning {
  id: string;
  reason: string;
  createdAt: Date;
  isRead: boolean;
}

export interface BanData {
  reason: string;
  bannedBy: string;
}

interface UserContextType {
  currentUser: User | null;
  users: User[] | null;
  createUsername: (username?: string) => Promise<User>;
  banUser: (
    userId: string,
    reason: string,
    expiresAt?: Date | null,
  ) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
  addWarning: (userId: string, reason: string) => Promise<void>;
  markWarningsAsRead: (userId: string) => Promise<void>;
  checkUserStatus: () => Promise<void>;
  generateRandomUsername: () => string;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const generateRandomUsername = (): string => {
  const adjectives = [
    "Swift",
    "Dark",
    "Cyber",
    "Ghost",
    "Stealth",
    "Shadow",
    "Elite",
    "Pro",
    "Master",
    "Alpha",
    "Neo",
    "Quantum",
    "Digital",
    "Binary",
    "Neon",
    "Matrix",
  ];
  const nouns = [
    "Hunter",
    "Warrior",
    "Phantom",
    "Knight",
    "Agent",
    "Hacker",
    "Player",
    "Gamer",
    "Coder",
    "Ninja",
    "Wolf",
    "Tiger",
    "Dragon",
    "Phoenix",
    "Viper",
  ];

  const randomNumber = Math.floor(Math.random() * 9999) + 1;
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective}${noun}${randomNumber}`;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);

  // Helper function to convert Firestore data to User objects
  const parseUser = (userData: any): User => {
    return {
      ...userData,
      role: userData.role || "user", // Migration: rôle par défaut pour les anciens utilisateurs
      createdAt: userData.createdAt?.toDate() || new Date(),
      lastSeen: userData.lastSeen?.toDate() || new Date(),
      bannedAt: userData.bannedAt?.toDate() || undefined,
      banExpiresAt: userData.banExpiresAt?.toDate() || null,
      warnings: (userData.warnings || []).map((warning: any) => ({
        ...warning,
        createdAt: warning.createdAt?.toDate() || new Date(),
      })),
    };
  };

  // Helper function to convert User object to Firestore data
  const userToFirestore = (user: User) => {
    return {
      ...user,
      createdAt: Timestamp.fromDate(user.createdAt),
      lastSeen: Timestamp.fromDate(user.lastSeen),
      bannedAt: user.bannedAt ? Timestamp.fromDate(user.bannedAt) : null,
      banExpiresAt: user.banExpiresAt
        ? Timestamp.fromDate(user.banExpiresAt)
        : null,
      warnings: user.warnings.map((warning) => ({
        ...warning,
        createdAt: Timestamp.fromDate(warning.createdAt),
      })),
    };
  };

  // Helper function to find existing user by username
  const findUserByUsername = async (username: string): Promise<User | null> => {
    try {
      if (!shouldUseFirebase()) {
        return null;
      }

      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return parseUser({ id: userDoc.id, ...userDoc.data() });
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la recherche de l'utilisateur:", error);
      return null;
    }
  };

  // Load current user on mount
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        const storedUsername = localStorage.getItem("username");

        if (storedUserId && storedUsername) {
          // First, try to find existing user by username to avoid duplicates
          const existingUser = await findUserByUsername(storedUsername);

          if (existingUser) {
            // User found by username, update localStorage and use this user
            localStorage.setItem("userId", existingUser.id);
            localStorage.setItem("username", existingUser.username);
            setCurrentUser(existingUser);

            // Update online status
            if (shouldUseFirebase()) {
              await updateDoc(doc(db, "users", existingUser.id), {
                isOnline: true,
                lastSeen: Timestamp.now(),
              });
            }

            console.log("🔵 Utilisateur existant trouvé par nom:", existingUser.username);
            return;
          }

          // If not found by username, try by stored ID
          if (shouldUseFirebase()) {
            const userDoc = await getDoc(doc(db, "users", storedUserId));

            if (userDoc.exists()) {
              const userData = parseUser({ id: userDoc.id, ...userDoc.data() });
              setCurrentUser(userData);

              // Update online status
              await updateDoc(doc(db, "users", storedUserId), {
                isOnline: true,
                lastSeen: Timestamp.now(),
              });

              console.log("🔵 Utilisateur Firebase chargé par ID:", storedUsername);
              return;
            }
          }

          // User not found anywhere, recreate
          await recreateUser(storedUserId, storedUsername);
        } else {
          // Check if user was supposed to have been created
          const hasEverCreatedUser = localStorage.getItem("hasCreatedUser");
          if (hasEverCreatedUser === "true") {
            // Try to get the last saved username to maintain consistency
            const lastUsername =
              localStorage.getItem("lastUsername") || generateRandomUsername();

            // Check if this username already exists
            const existingUser = await findUserByUsername(lastUsername);
            if (existingUser) {
              // Use existing user
              localStorage.setItem("userId", existingUser.id);
              localStorage.setItem("username", existingUser.username);
              setCurrentUser(existingUser);

              if (shouldUseFirebase()) {
                await updateDoc(doc(db, "users", existingUser.id), {
                  isOnline: true,
                  lastSeen: Timestamp.now(),
                });
              }

              console.log("🔵 Utilisateur existant retrouvé:", existingUser.username);
            } else {
              const userId = Date.now().toString();
              localStorage.setItem("lastUsername", lastUsername);
              await recreateUser(userId, lastUsername);
            }
          } else {
            console.log("🟡 Aucun utilisateur trouvé - modal va s'afficher");
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
      }
    };

    checkExistingUser();
  }, []);

  // Listen to all users changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc")),
      (snapshot) => {
        try {
          const usersData = snapshot.docs.map((doc) =>
            parseUser({ id: doc.id, ...doc.data() }),
          );
          setUsers(usersData);
          console.log("📋 Utilisateurs Firebase chargés:", usersData.length);
        } catch (error) {
          console.error("Erreur lors du chargement des utilisateurs:", error);
          setUsers([]);
        }
      },
      (error) => {
        console.error("Erreur listener utilisateurs:", error);
        if (
          error.message &&
          (error.message.includes("permissions") ||
            error.message.includes("Missing or insufficient"))
        ) {
          console.log(
            "⚠️ Permissions Firebase manquantes pour les utilisateurs - mode dégradé",
          );
          // Fallback: utiliser un utilisateur local basique
          const localUser = localStorage.getItem("username");
          if (localUser && !currentUser) {
            console.log("🔄 Fallback: mode utilisateur local activé");
          }
        }
        setUsers([]);
      },
    );

    return () => unsubscribe();
  }, []);

  // Listen to current user changes - with proper dependency management
  useEffect(() => {
    if (!currentUser?.id || !shouldUseFirebase()) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", currentUser.id),
      (doc) => {
        if (doc.exists()) {
          const userData = parseUser({ id: doc.id, ...doc.data() });
          // Force update even if the reference is the same
          setCurrentUser((prevUser) => {
            const newUser = userData;
            console.log(
              "🔄 Mise à jour utilisateur:",
              newUser.username,
              "|",
              newUser.role,
            );
            return newUser;
          });
        }
      },
      (error) => {
        console.error("Erreur listener utilisateur actuel:", error);
      },
    );

    return () => unsubscribe();
  }, [currentUser?.id]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentUser?.id) {
        try {
          await updateDoc(doc(db, "users", currentUser.id), {
            isOnline: false,
            lastSeen: Timestamp.now(),
          });
        } catch (error) {
          console.error("Erreur lors de la déconnexion:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentUser?.id]);

  const recreateUser = async (userId: string, username: string) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("lastUsername", username);
    localStorage.setItem("hasCreatedUser", "true");

    const newUser: User = {
      id: userId,
      username: username,
      role: "user",
      isOnline: true,
      isBanned: false,
      warnings: [],
      createdAt: new Date(),
      lastSeen: new Date(),
    };

    await setDoc(doc(db, "users", userId), userToFirestore(newUser));
    setCurrentUser(newUser);
    console.log("🟢 Utilisateur Firebase recrée:", username);
  };

  const createUsername = async (username?: string): Promise<User> => {
    try {
      const finalUsername = username || generateRandomUsername();

      // Check if username already exists
      const existingUser = await findUserByUsername(finalUsername);
      if (existingUser) {
        // Username already exists, use that user instead of creating a new one
        localStorage.setItem("userId", existingUser.id);
        localStorage.setItem("username", existingUser.username);
        localStorage.setItem("lastUsername", existingUser.username);
        localStorage.setItem("hasCreatedUser", "true");

        // Update online status
        if (shouldUseFirebase()) {
          await updateDoc(doc(db, "users", existingUser.id), {
            isOnline: true,
            lastSeen: Timestamp.now(),
          });
        }

        setCurrentUser(existingUser);
        console.log("🔄 Utilisateur existant réutilisé:", existingUser.username);
        return existingUser;
      }

      // Username doesn't exist, create new user
      const userId = Date.now().toString();

      localStorage.setItem("userId", userId);
      localStorage.setItem("username", finalUsername);
      localStorage.setItem("lastUsername", finalUsername);
      localStorage.setItem("hasCreatedUser", "true");

      const newUser: User = {
        id: userId,
        username: finalUsername,
        role: "user",
        isOnline: true,
        isBanned: false,
        warnings: [],
        createdAt: new Date(),
        lastSeen: new Date(),
      };

      if (shouldUseFirebase()) {
        await setDoc(doc(db, "users", userId), userToFirestore(newUser));
      }
      setCurrentUser(newUser);
      console.log("🎉 Nouvel utilisateur Firebase créé:", finalUsername);
      return newUser;
    } catch (error) {
      console.error("Error creating username:", error);
      throw error;
    }
  };

  const banUser = async (
    userId: string,
    reason: string,
    expiresAt?: Date | null,
  ): Promise<void> => {
    try {
      const updateData: any = {
        isBanned: true,
        banReason: reason,
        bannedAt: Timestamp.now(),
        banExpiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : null,
      };

      await updateDoc(doc(db, "users", userId), updateData);

      const banType = expiresAt ? "temporaire" : "permanent";
      console.log(`🚫 Utilisateur Firebase banni (${banType}):`, userId);
    } catch (error) {
      console.error("Erreur lors du bannissement:", error);
      throw error;
    }
  };

  const unbanUser = async (userId: string): Promise<void> => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isBanned: false,
        banReason: null,
        bannedAt: null,
        banExpiresAt: null,
      });
      console.log("✅ Utilisateur Firebase débanni:", userId);
    } catch (error) {
      console.error("Erreur lors du débannissement:", error);
      throw error;
    }
  };

  const addWarning = async (userId: string, reason: string): Promise<void> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const newWarning = {
          id: Date.now().toString(),
          reason,
          createdAt: Timestamp.now(),
          isRead: false,
        };

        const updatedWarnings = [...(userData.warnings || []), newWarning];

        await updateDoc(doc(db, "users", userId), {
          warnings: updatedWarnings,
        });

        console.log("⚠️ Avertissement Firebase ajouté:", userId);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'avertissement:", error);
      throw error;
    }
  };

  const markWarningsAsRead = async (userId: string): Promise<void> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedWarnings = (userData.warnings || []).map((w: any) => ({
          ...w,
          isRead: true,
        }));

        await updateDoc(doc(db, "users", userId), {
          warnings: updatedWarnings,
        });

        console.log("✅ Avertissements Firebase marqués comme lus:", userId);
      }
    } catch (error) {
      console.error("Erreur lors du marquage des avertissements:", error);
      throw error;
    }
  };

  const checkUserStatus = async (): Promise<void> => {
    if (!currentUser?.id) return;

    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.id));
      if (userDoc.exists()) {
        const userData = parseUser({ id: userDoc.id, ...userDoc.data() });
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
    }
  };

  const updateUserRole = async (
    userId: string,
    role: UserRole,
  ): Promise<void> => {
    try {
      if (!shouldUseFirebase()) {
        // Update locally if Firebase is not available
        if (currentUser?.id === userId) {
          setCurrentUser((prev) => (prev ? { ...prev, role } : null));
        }
        setUsers(
          (prevUsers) =>
            prevUsers?.map((user) =>
              user.id === userId ? { ...user, role } : user,
            ) || null,
        );
        console.log("👑 Rôle utilisateur mis à jour localement:", userId, role);
        return;
      }

      await updateDoc(doc(db, "users", userId), {
        role: role,
      });

      // Force immediate update for better UX
      if (currentUser?.id === userId) {
        setCurrentUser((prev) => (prev ? { ...prev, role } : null));
        // Save role to localStorage for persistence
        localStorage.setItem("userRole", role);
      }

      console.log("👑 Rôle utilisateur Firebase mis à jour:", userId, role);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      throw error;
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      if (!shouldUseFirebase()) {
        // Mode local - supprimer de la liste
        setUsers(
          (prevUsers) =>
            prevUsers?.filter((user) => user.id !== userId) || null,
        );

        // Si c'est l'utilisateur actuel, le déconnecter
        if (currentUser?.id === userId) {
          setCurrentUser(null);
          localStorage.removeItem("userId");
          localStorage.removeItem("username");
          localStorage.removeItem("userRole");
        }

        console.log("🗑️ Utilisateur supprimé localement:", userId);
        return;
      }

      // Supprimer de Firebase
      await deleteDoc(doc(db, "users", userId));

      // Si c'est l'utilisateur actuel, le déconnecter
      if (currentUser?.id === userId) {
        setCurrentUser(null);
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        localStorage.removeItem("lastUsername");
        localStorage.removeItem("hasCreatedUser");
      }

      console.log("🗑️ Utilisateur Firebase supprimé:", userId);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        users,
        createUsername,
        banUser,
        unbanUser,
        addWarning,
        markWarningsAsRead,
        checkUserStatus,
        generateRandomUsername,
        updateUserRole,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
