import React, { createContext, useContext, useState, useEffect } from "react";
// Temporarily comment out Firebase imports to debug
// import {
//   collection,
//   doc,
//   setDoc,
//   getDoc,
//   onSnapshot,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   addDoc,
//   Timestamp
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";

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
    "Swift", "Dark", "Cyber", "Ghost", "Stealth", "Shadow", "Elite", "Pro", 
    "Master", "Alpha", "Neo", "Quantum", "Digital", "Binary", "Neon", "Matrix"
  ];
  const nouns = [
    "Hunter", "Warrior", "Phantom", "Knight", "Agent", "Hacker", "Player", 
    "Gamer", "Coder", "Ninja", "Wolf", "Tiger", "Dragon", "Phoenix", "Viper"
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

  // Check user status on load
  useEffect(() => {
    const checkExistingUser = async () => {
      // Check localStorage for existing user
      const storedUserId = localStorage.getItem("userId");
      const storedUsername = localStorage.getItem("username");

      if (storedUserId && storedUsername) {
        // Load existing user
        const user: User = {
          id: storedUserId,
          username: storedUsername,
          isOnline: true,
          isBanned: false,
          warnings: [],
          createdAt: new Date(),
          lastSeen: new Date(),
        };
        setCurrentUser(user);
        console.log("🔵 Utilisateur existant chargé:", storedUsername);
      } else {
        // Check if user was supposed to have been created
        const hasEverCreatedUser = localStorage.getItem("hasCreatedUser");
        if (hasEverCreatedUser === "true") {
          // User was created before but data is missing, recreate
          const username = generateRandomUsername();
          const userId = Date.now().toString();

          localStorage.setItem("userId", userId);
          localStorage.setItem("username", username);

          const user: User = {
            id: userId,
            username: username,
            isOnline: true,
            isBanned: false,
            warnings: [],
            createdAt: new Date(),
            lastSeen: new Date(),
          };
          setCurrentUser(user);
          console.log("🟢 Utilisateur recrée:", username);
        } else {
          console.log("🟡 Aucun utilisateur trouvé - modal va s'afficher");
        }
      }
    };

    checkExistingUser();
  }, []);

  // Load all users from localStorage
  useEffect(() => {
    const loadAllUsers = () => {
      try {
        const stored = localStorage.getItem("allUsers");
        if (stored) {
          const usersData = JSON.parse(stored) as User[];
          setUsers(usersData);
          console.log("📋 Utilisateurs chargés:", usersData.length);
        } else {
          setUsers([]);
          console.log("📋 Aucun utilisateur dans la base");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
        setUsers([]);
      }
    };

    loadAllUsers();
  }, []);

  // Simplified user changes listener
  useEffect(() => {
    // No Firebase listener for now
  }, [currentUser?.id]);

  // Simplified beforeunload
  useEffect(() => {
    // No Firebase operations for now
  }, [currentUser?.id]);

  const saveUserToDatabase = (user: User) => {
    try {
      // Get all users from localStorage
      const stored = localStorage.getItem("allUsers");
      let allUsers: User[] = stored ? JSON.parse(stored) : [];

      // Check if user already exists
      const existingIndex = allUsers.findIndex(u => u.id === user.id);
      if (existingIndex >= 0) {
        // Update existing user
        allUsers[existingIndex] = user;
      } else {
        // Add new user
        allUsers.push(user);
      }

      // Save back to localStorage
      localStorage.setItem("allUsers", JSON.stringify(allUsers));
      setUsers(allUsers);
      console.log("💾 Utilisateur sauvegardé dans la base:", user.username);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const createUsername = async (username?: string): Promise<User> => {
    try {
      const finalUsername = username || generateRandomUsername();

      // Save to localStorage
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

      setCurrentUser(newUser);
      saveUserToDatabase(newUser);
      console.log("🎉 Nouvel utilisateur créé:", finalUsername);
      return newUser;
    } catch (error) {
      console.error("Error creating username:", error);
      throw error;
    }
  };

  const banUser = async (userId: string, reason: string): Promise<void> => {
    try {
      const stored = localStorage.getItem("allUsers");
      if (stored) {
        let allUsers: User[] = JSON.parse(stored);
        const userIndex = allUsers.findIndex(u => u.id === userId);

        if (userIndex >= 0) {
          allUsers[userIndex] = {
            ...allUsers[userIndex],
            isBanned: true,
            banReason: reason,
            bannedAt: new Date(),
          };

          localStorage.setItem("allUsers", JSON.stringify(allUsers));
          setUsers(allUsers);

          // If it's the current user, update them too
          if (currentUser?.id === userId) {
            setCurrentUser(allUsers[userIndex]);
          }

          console.log("🚫 Utilisateur banni:", allUsers[userIndex].username);
        }
      }
    } catch (error) {
      console.error("Erreur lors du bannissement:", error);
      throw error;
    }
  };

  const addWarning = async (userId: string, reason: string): Promise<void> => {
    try {
      const stored = localStorage.getItem("allUsers");
      if (stored) {
        let allUsers: User[] = JSON.parse(stored);
        const userIndex = allUsers.findIndex(u => u.id === userId);

        if (userIndex >= 0) {
          const newWarning: Warning = {
            id: Date.now().toString(),
            reason,
            createdAt: new Date(),
            isRead: false,
          };

          allUsers[userIndex] = {
            ...allUsers[userIndex],
            warnings: [...(allUsers[userIndex].warnings || []), newWarning],
          };

          localStorage.setItem("allUsers", JSON.stringify(allUsers));
          setUsers(allUsers);

          // If it's the current user, update them too
          if (currentUser?.id === userId) {
            setCurrentUser(allUsers[userIndex]);
          }

          console.log("⚠️ Avertissement ajouté:", allUsers[userIndex].username);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'avertissement:", error);
      throw error;
    }
  };

  const markWarningsAsRead = async (userId: string): Promise<void> => {
    try {
      const stored = localStorage.getItem("allUsers");
      if (stored) {
        let allUsers: User[] = JSON.parse(stored);
        const userIndex = allUsers.findIndex(u => u.id === userId);

        if (userIndex >= 0) {
          allUsers[userIndex] = {
            ...allUsers[userIndex],
            warnings: (allUsers[userIndex].warnings || []).map(w => ({
              ...w,
              isRead: true,
            })),
          };

          localStorage.setItem("allUsers", JSON.stringify(allUsers));
          setUsers(allUsers);

          // If it's the current user, update them too
          if (currentUser?.id === userId) {
            setCurrentUser(allUsers[userIndex]);
          }

          console.log("✅ Avertissements marqués comme lus:", allUsers[userIndex].username);
        }
      }
    } catch (error) {
      console.error("Erreur lors du marquage des avertissements:", error);
      throw error;
    }
  };

  const checkUserStatus = async (): Promise<void> => {
    // Simplified for debug
    console.log("Check user status");
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
