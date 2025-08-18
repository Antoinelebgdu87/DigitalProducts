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
  Timestamp
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

// Generate a unique device ID for this browser session
const getDeviceId = (): string => {
  // Use a combination of browser fingerprinting techniques
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [deviceId] = useState<string>(getDeviceId());

  // Helper function to convert Firebase timestamps to dates
  const parseUserFromFirebase = (userData: any): User => {
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

  // Check user status on load
  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        // Check if there's a user for this device in Firebase
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("deviceId", "==", deviceId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // User exists for this device
          const userDoc = querySnapshot.docs[0];
          const userData = parseUserFromFirebase(userDoc.data());
          userData.id = userDoc.id;
          
          // Update last seen and online status
          await updateDoc(doc(db, "users", userData.id), {
            lastSeen: Timestamp.now(),
            isOnline: true
          });
          
          setCurrentUser(userData);
          console.log("🔵 Utilisateur existant chargé depuis Firebase:", userData.username);
        } else {
          console.log("🟡 Aucun utilisateur trouvé pour cet appareil - modal va s'afficher");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error);
      }
    };

    checkExistingUser();
  }, [deviceId]);

  // Load all users from Firebase
  useEffect(() => {
    const loadAllUsers = () => {
      try {
        const usersRef = collection(db, "users");
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
          const usersData = snapshot.docs.map(doc => {
            const userData = parseUserFromFirebase(doc.data());
            userData.id = doc.id;
            return userData;
          });
          
          setUsers(usersData);
          console.log("📋 Utilisateurs chargés depuis Firebase:", usersData.length);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
        setUsers([]);
      }
    };

    const unsubscribe = loadAllUsers();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Listen to current user changes
  useEffect(() => {
    if (!currentUser?.id) return;

    const userDocRef = doc(db, "users", currentUser.id);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = parseUserFromFirebase(doc.data());
        userData.id = doc.id;
        setCurrentUser(userData);
      }
    });

    return () => unsubscribe();
  }, [currentUser?.id]);

  // Handle page unload - set user offline
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentUser?.id) {
        try {
          await updateDoc(doc(db, "users", currentUser.id), {
            isOnline: false,
            lastSeen: Timestamp.now()
          });
        } catch (error) {
          console.error("Erreur lors de la mise hors ligne:", error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser?.id]);

  const createUsername = async (username?: string): Promise<User> => {
    try {
      const finalUsername = username || generateRandomUsername();

      const newUser = {
        username: finalUsername,
        deviceId: deviceId,
        isOnline: true,
        isBanned: false,
        warnings: [],
        createdAt: Timestamp.now(),
        lastSeen: Timestamp.now(),
      };

      // Add user to Firebase
      const docRef = await addDoc(collection(db, "users"), newUser);
      
      const createdUser: User = {
        id: docRef.id,
        username: finalUsername,
        isOnline: true,
        isBanned: false,
        warnings: [],
        createdAt: new Date(),
        lastSeen: new Date(),
      };

      setCurrentUser(createdUser);
      console.log("🎉 Nouvel utilisateur créé dans Firebase:", finalUsername);
      return createdUser;
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      throw error;
    }
  };

  const banUser = async (userId: string, reason: string): Promise<void> => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isBanned: true,
        banReason: reason,
        bannedAt: Timestamp.now(),
      });

      console.log("🚫 Utilisateur banni dans Firebase:", userId);
    } catch (error) {
      console.error("Erreur lors du bannissement:", error);
      throw error;
    }
  };

  const addWarning = async (userId: string, reason: string): Promise<void> => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const existingWarnings = userData.warnings || [];
        
        const newWarning = {
          id: Date.now().toString(),
          reason,
          createdAt: Timestamp.now(),
          isRead: false,
        };

        await updateDoc(userRef, {
          warnings: [...existingWarnings, newWarning]
        });

        console.log("⚠️ Avertissement ajouté dans Firebase:", userId);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'avertissement:", error);
      throw error;
    }
  };

  const markWarningsAsRead = async (userId: string): Promise<void> => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedWarnings = (userData.warnings || []).map((warning: any) => ({
          ...warning,
          isRead: true,
        }));

        await updateDoc(userRef, {
          warnings: updatedWarnings
        });

        console.log("✅ Avertissements marqués comme lus dans Firebase:", userId);
      }
    } catch (error) {
      console.error("Erreur lors du marquage des avertissements:", error);
      throw error;
    }
  };

  const checkUserStatus = async (): Promise<void> => {
    if (!currentUser?.id) return;
    
    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, {
        lastSeen: Timestamp.now()
      });
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
