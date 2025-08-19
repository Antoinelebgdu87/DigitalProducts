export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: "free" | "paid";
  actionType: "download" | "discord";
  downloadUrl: string;
  contentType: "link" | "text";
  content?: string;
  discordUrl?: string;
  createdBy: string; // Rendu obligatoire pour traçabilité
  createdByUsername: string; // Nom d'utilisateur du créateur
  price?: number;
  lives?: number;
  createdAt: Date;
}

export interface License {
  id: string;
  productId: string;
  code: string;
  category: "compte" | "carte-cadeau" | "cheat";
  maxUsages: number;
  currentUsages: number;
  createdAt: Date;
  isActive: boolean;
}

export interface MaintenanceSettings {
  isActive: boolean;
  message: string;
}

export interface Comment {
  id: string;
  productId: string;
  userId: string;
  username: string;
  userRole: UserRole;
  content: string;
  createdAt: Date;
}

export type UserRole = "user" | "shop_access" | "partner" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  isBanned?: boolean;
  banReason?: string;
  warnings?: Array<{
    id: string;
    reason: string;
    createdAt: Date;
  }>;
  lastProductCreation?: Date; // Pour le système de cooldown
  customTitle?: string; // Titre custom pour les partners
}

export interface TimerSettings {
  shopProductCooldown: number; // En minutes
  commentCooldown: number; // En minutes
}

export interface AdminMode {
  isShopMode: boolean; // Mode boutique pour les admins
  selectedUserId?: string; // Pour agir au nom d'un utilisateur
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface ModerationAction {
  id: string;
  type: "delete_product" | "delete_comment" | "ban_user" | "warn_user";
  targetId: string; // ID du produit, commentaire ou utilisateur ciblé
  targetType: "product" | "comment" | "user";
  moderatorId: string;
  moderatorUsername: string;
  reason: string;
  createdAt: Date;
}
