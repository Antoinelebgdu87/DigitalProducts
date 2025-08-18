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
      // Simplified for debug - just check localStorage
      const storedUserId = localStorage.getItem("userId");
      const storedUsername = localStorage.getItem("username");

      if (storedUserId && storedUsername) {
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

      // Simplified - just use localStorage for now
      const userId = Date.now().toString();
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", finalUsername);

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
      
      // Log the ban action
      await addDoc(collection(db, "admin-actions"), {
        type: "ban",
        userId,
        reason,
        timestamp: Timestamp.now(),
        adminUser: "admin",
      });
    } catch (error) {
      console.error("Error banning user:", error);
      throw error;
    }
  };

  const addWarning = async (userId: string, reason: string): Promise<void> => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const newWarning: Warning = {
          id: Date.now().toString(),
          reason,
          createdAt: new Date(),
          isRead: false,
        };
        
        const updatedWarnings = [...(userData.warnings || []), newWarning];
        
        await updateDoc(userRef, {
          warnings: updatedWarnings,
        });
        
        // Log the warning action
        await addDoc(collection(db, "admin-actions"), {
          type: "warning",
          userId,
          reason,
          timestamp: Timestamp.now(),
          adminUser: "admin",
        });
      }
    } catch (error) {
      console.error("Error adding warning:", error);
      throw error;
    }
  };

  const markWarningsAsRead = async (userId: string): Promise<void> => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedWarnings = (userData.warnings || []).map((warning: Warning) => ({
          ...warning,
          isRead: true,
        }));
        
        await updateDoc(userRef, {
          warnings: updatedWarnings,
        });
      }
    } catch (error) {
      console.error("Error marking warnings as read:", error);
      throw error;
    }
  };

  const checkUserStatus = async (): Promise<void> => {
    if (currentUser?.id) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.id));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isBanned) {
            // User is banned, handle this in the UI
            return;
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
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
