export type UserRole = "ADMIN" | "COOK" | "STUDENT" | "CLIENT";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentMethod = "wave" | "orange_money" | "cash";

export type PaymentStatus = "pending" | "paid" | "failed" | "cash_pending";

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  fullName?: string; // For Clients
  phoneNumber?: string;
  allergies?: string[];
  otherAllergies?: string;
  displayName: string;
  photoURL?: string;
  points: number;
  createdAt: any;
  updatedAt?: any;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  green?: boolean;
  allergens?: string[];
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  kcal?: number;
  tags?: string[];
  prepTime?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  transactionId?: string;
  slot: string;
  tableId?: string;
  qrCode?: string;
  estimatedPrepTime?: number; // in minutes
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
}

export interface Review {
  id: string;
  userId: string;
  userName?: string;
  userPhoto?: string;
  menuItemId: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface TimeSlot {
  id: string;
  time: string;
  affluence: "low" | "medium" | "high";
  description: string;
  bonusPoints: number;
}

export interface Reward {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  icon?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  status: "ok" | "low" | "out";
  updatedAt: any;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "general" | "alert" | "update";
  createdAt: any;
}
