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
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface User {
  id: string;
  username: string;
  isOnline: boolean;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: Date;
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
  banUser: (userId: string, reason: string) => Promise<void>;
  addWarning: (userId: string, reason: string) => Promise<void>;
  markWarningsAsRead: (userId: string) => Promise<void>;
  checkUserStatus: () => Promise<void>;
  generateRandomUsername: () => string;
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
      createdAt: userData.createdAt?.toDate() || new Date(),
      lastSeen: userData.lastSeen?.toDate() || new Date(),
      bannedAt: userData.bannedAt?.toDate() || undefined,
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
      warnings: user.warnings.map((warning) => ({
        ...warning,
        createdAt: Timestamp.fromDate(warning.createdAt),
      })),
    };
  };

  // Load current user on mount
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        const storedUsername = localStorage.getItem("username");

        if (storedUserId && storedUsername) {
          // Load user from Firebase
          const userDoc = await getDoc(doc(db, "users", storedUserId));

          if (userDoc.exists()) {
            const userData = parseUser({ id: userDoc.id, ...userDoc.data() });
            setCurrentUser(userData);

            // Update online status
            await updateDoc(doc(db, "users", storedUserId), {
              isOnline: true,
              lastSeen: Timestamp.now(),
            });

            console.log("🔵 Utilisateur Firebase chargé:", storedUsername);
          } else {
            // User not in Firebase, recreate
            await recreateUser(storedUserId, storedUsername);
          }
        } else {
          // Check if user was supposed to have been created
          const hasEverCreatedUser = localStorage.getItem("hasCreatedUser");
          if (hasEverCreatedUser === "true") {
            // Recreate with new ID
            const username = generateRandomUsername();
            const userId = Date.now().toString();
            await recreateUser(userId, username);
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
        if (error.message && (error.message.includes('permissions') || error.message.includes('Missing or insufficient'))) {
          console.log("⚠️ Permissions Firebase manquantes pour les utilisateurs - mode dégradé");
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

  // Listen to current user changes
  useEffect(() => {
    if (!currentUser?.id) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", currentUser.id),
      (doc) => {
        if (doc.exists()) {
          const userData = parseUser({ id: doc.id, ...doc.data() });
          setCurrentUser(userData);
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
    localStorage.setItem("hasCreatedUser", "true");

    const newUser: User = {
      id: userId,
      username: username,
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
      const userId = Date.now().toString();

      localStorage.setItem("userId", userId);
      localStorage.setItem("username", finalUsername);
      localStorage.setItem("hasCreatedUser", "true");

      const newUser: User = {
        id: userId,
        username: finalUsername,
        isOnline: true,
        isBanned: false,
        warnings: [],
        createdAt: new Date(),
        lastSeen: new Date(),
      };

      await setDoc(doc(db, "users", userId), userToFirestore(newUser));
      setCurrentUser(newUser);
      console.log("🎉 Nouvel utilisateur Firebase créé:", finalUsername);
      return newUser;
    } catch (error) {
      console.error("Error creating username:", error);
      throw error;
    }
  };

  const banUser = async (userId: string, reason: string): Promise<void> => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isBanned: true,
        banReason: reason,
        bannedAt: Timestamp.now(),
      });
      console.log("🚫 Utilisateur Firebase banni:", userId);
    } catch (error) {
      console.error("Erreur lors du bannissement:", error);
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

  return (
    <UserContext.Provider
      value={{
        currentUser,
        users,
        createUsername,
        banUser,
        addWarning,
        markWarningsAsRead,
        checkUserStatus,
        generateRandomUsername,
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
