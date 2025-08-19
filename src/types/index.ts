export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: "free" | "paid";
  downloadUrl: string;
  contentType: "link" | "text";
  content?: string;
  discordUrl?: string;
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

export interface AdminCredentials {
  username: string;
  password: string;
}
