import { z } from "zod";

export const UserRoleSchema = z.enum([
  "STUDENT",
  "COOK",
  "ADMIN",
  "SERVER",
  "MANAGER",
  "SUPER_ADMIN",
]);

export const UserProfileSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  role: UserRoleSchema,
  displayName: z.string().min(1),
  createdAt: z.string().optional(),
});

export const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const OrderSchema = z.object({
  userId: z.string().min(1),
  items: z.array(OrderItemSchema).min(1),
  total: z.number().positive(),
  status: z.enum(["pending", "preparing", "ready", "completed"]),
  slot: z.string(),
  tableId: z.string().optional(),
});

export const StockUpdateSchema = z.object({
  itemId: z.string(),
  stock: z.number().int().min(0),
});
