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
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        try {
          const userDoc = await getDoc(doc(db, "users", storedUserId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user: User = {
              id: userDoc.id,
              username: userData.username,
              isOnline: true,
              isBanned: userData.isBanned || false,
              banReason: userData.banReason,
              bannedAt: userData.bannedAt?.toDate(),
              warnings: userData.warnings || [],
              createdAt: userData.createdAt?.toDate() || new Date(),
              lastSeen: new Date(),
            };
            
            // Update user as online
            await updateDoc(doc(db, "users", storedUserId), {
              isOnline: true,
              lastSeen: Timestamp.now(),
            });
            
            setCurrentUser(user);
          } else {
            localStorage.removeItem("userId");
          }
        } catch (error) {
          console.error("Error checking existing user:", error);
          localStorage.removeItem("userId");
        }
      }
    };

    checkExistingUser();
  }, []);

  // Listen to users collection
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const usersData: User[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            username: data.username,
            isOnline: data.isOnline || false,
            isBanned: data.isBanned || false,
            banReason: data.banReason,
            bannedAt: data.bannedAt?.toDate(),
            warnings: data.warnings || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            lastSeen: data.lastSeen?.toDate() || new Date(),
          };
        });
        setUsers(usersData);
      },
      (error) => {
        console.error("Error listening to users:", error);
      }
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
          const userData = doc.data();
          const updatedUser: User = {
            id: doc.id,
            username: userData.username,
            isOnline: userData.isOnline || false,
            isBanned: userData.isBanned || false,
            banReason: userData.banReason,
            bannedAt: userData.bannedAt?.toDate(),
            warnings: userData.warnings || [],
            createdAt: userData.createdAt?.toDate() || new Date(),
            lastSeen: userData.lastSeen?.toDate() || new Date(),
          };
          setCurrentUser(updatedUser);
        }
      },
      (error) => {
        console.error("Error listening to current user:", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.id]);

  // Set user offline on beforeunload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentUser?.id) {
        try {
          await updateDoc(doc(db, "users", currentUser.id), {
            isOnline: false,
            lastSeen: Timestamp.now(),
          });
        } catch (error) {
          console.error("Error setting user offline:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [currentUser?.id]);

  const createUsername = async (username?: string): Promise<User> => {
    try {
      const finalUsername = username || generateRandomUsername();
      
      // Check if username already exists
      const usernameQuery = query(
        collection(db, "users"),
        where("username", "==", finalUsername)
      );
      const existingUsers = await getDocs(usernameQuery);
      
      if (!existingUsers.empty) {
        throw new Error("Username already exists");
      }

      const userData = {
        username: finalUsername,
        isOnline: true,
        isBanned: false,
        warnings: [],
        createdAt: Timestamp.now(),
        lastSeen: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "users"), userData);
      localStorage.setItem("userId", docRef.id);
      
      const newUser: User = {
        id: docRef.id,
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
