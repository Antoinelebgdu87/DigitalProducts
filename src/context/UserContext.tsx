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

  // Temporarily simplified - no Firebase listeners
  useEffect(() => {
    // Mock users data
    setUsers([]);
  }, []);

  // Simplified user changes listener
  useEffect(() => {
    // No Firebase listener for now
  }, [currentUser?.id]);

  // Simplified beforeunload
  useEffect(() => {
    // No Firebase operations for now
  }, [currentUser?.id]);

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
      console.log("🎉 Nouvel utilisateur créé:", finalUsername);
      return newUser;
    } catch (error) {
      console.error("Error creating username:", error);
      throw error;
    }
  };

  const banUser = async (userId: string, reason: string): Promise<void> => {
    // Simplified for debug
    console.log("Ban user:", userId, reason);
  };

  const addWarning = async (userId: string, reason: string): Promise<void> => {
    // Simplified for debug
    console.log("Add warning:", userId, reason);
  };

  const markWarningsAsRead = async (userId: string): Promise<void> => {
    // Simplified for debug
    console.log("Mark warnings as read:", userId);
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
