export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: "free" | "paid";
  downloadUrl: string;
  createdAt: Date;
}

export interface License {
  id: string;
  productId: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
  isUsed: boolean;
}

export interface MaintenanceSettings {
  isActive: boolean;
  message: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}
