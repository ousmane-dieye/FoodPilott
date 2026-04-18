import { Order } from "../types";
import { MOCK_MENU } from "./menu";

export const MOCK_ORDERS: Order[] = [
  {
    id: "o1",
    userId: "demo_student",
    items: [
      { ...MOCK_MENU[0], quantity: 1 },
      { ...MOCK_MENU[7], quantity: 1 }
    ],
    total: 4000,
    status: "pending",
    slot: "12:15",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "o2",
    userId: "st_2",
    items: [
      { ...MOCK_MENU[1], quantity: 2 },
      { ...MOCK_MENU[9], quantity: 1 }
    ],
    total: 5300,
    status: "preparing",
    slot: "12:00",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: "o3",
    userId: "st_3",
    items: [
      { ...MOCK_MENU[2], quantity: 1 }
    ],
    total: 2800,
    status: "ready",
    slot: "11:45",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: "o4",
    userId: "st_4",
    items: [
      { ...MOCK_MENU[6], quantity: 1 },
      { ...MOCK_MENU[8], quantity: 1 }
    ],
    total: 2300,
    status: "completed",
    slot: "11:00",
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 100 * 60 * 1000).toISOString()
  }
];
