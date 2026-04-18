/**
 * MockOrderService
 * Simulation d'un système de commande et paiement pour démonstration (Hackathon)
 * Utilise localStorage pour la persistance locale sans dépendance API.
 */

export interface MockOrder {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status:
    | "pending"
    | "preparing"
    | "ready"
    | "served"
    | "completed"
    | "cancelled";
  paymentMethod: "wave" | "orange_money" | "cash";
  paymentStatus: "pending" | "paid" | "failed" | "cash_pending";
  transactionId?: string;
  slot: string;
  createdAt: string;
  qrData?: string;
}

const STORAGE_KEY = "foodpilot_mock_orders";

export const MockOrderService = {
  getOrders(): MockOrder[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const defaults: MockOrder[] = [
        {
          id: "#4581",
          userId: "demo_user",
          items: [
            { id: "1", name: "Thieboudienne Rouge", price: 2500, quantity: 1 },
          ],
          total: 2500,
          status: "completed",
          paymentMethod: "wave",
          paymentStatus: "paid",
          slot: "12:00",
          createdAt: "17/04/2026 12:45",
        },
        {
          id: "#4582",
          userId: "demo_user",
          items: [
            { id: "2", name: "Burger Pilot Triple", price: 3500, quantity: 1 },
          ],
          total: 3500,
          status: "served",
          paymentMethod: "cash",
          paymentStatus: "paid",
          slot: "13:00",
          createdAt: "18/04/2026 11:15",
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  },

  saveOrders(orders: MockOrder[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    // Déclencher un événement pour synchronisation entre onglets si besoin
    window.dispatchEvent(new Event("storage_update"));
  },

  createOrder(
    orderData: Omit<MockOrder, "id" | "createdAt" | "status" | "qrData">,
  ): MockOrder {
    const orders = this.getOrders();
    const newOrder: MockOrder = {
      ...orderData,
      id: `#${Math.floor(Math.random() * 9000 + 1000)}`,
      status: "pending",
      createdAt: new Date().toLocaleString("fr-FR"),
    };

    // Génération du contenu QR Code
    newOrder.qrData = JSON.stringify({
      orderId: newOrder.id,
      userId: newOrder.userId,
      amount: newOrder.total,
      status: newOrder.paymentStatus === "paid" ? "paid" : "pending",
      timestamp: new Date().getTime(),
    });

    orders.unshift(newOrder);
    this.saveOrders(orders);
    return newOrder;
  },

  updateOrderStatus(
    orderId: string,
    status: MockOrder["status"] | MockOrder["paymentStatus"],
  ) {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      const orderStatusList: MockOrder["status"][] = [
        "pending",
        "preparing",
        "ready",
        "served",
        "completed",
        "cancelled",
      ];
      const paymentStatusList: MockOrder["paymentStatus"][] = [
        "paid",
        "failed",
        "cash_pending",
      ];

      if (orderStatusList.includes(status as any)) {
        orders[index].status = status as MockOrder["status"];
      } else if (paymentStatusList.includes(status as any)) {
        orders[index].paymentStatus = status as MockOrder["paymentStatus"];
        // Update QR data if paid
        if (status === "paid") {
          try {
            const data = JSON.parse(orders[index].qrData || "{}");
            data.status = "paid";
            orders[index].qrData = JSON.stringify(data);
          } catch (e) {
            console.error("QR Parse Error", e);
          }
        }
      } else if (status === "pending") {
        // Special case for 'pending' which could be both. Default to order status.
        orders[index].status = "pending";
      }

      this.saveOrders(orders);
      return orders[index];
    }
    return null;
  },

  subscribeToOrders(callback: (orders: MockOrder[]) => void) {
    const handler = () => {
      callback(this.getOrders());
    };
    window.addEventListener("storage_update", handler);
    // Initial call
    handler();
    return () => window.removeEventListener("storage_update", handler);
  },
};

/**
 * MockReviewService
 * Permet aux étudiants de noter et commenter les plats.
 */
export interface MockReview {
  id: string;
  itemId: number;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const REVIEWS_KEY = "foodpilot_mock_reviews";

export const MockReviewService = {
  getReviews(): MockReview[] {
    const data = localStorage.getItem(REVIEWS_KEY);
    if (!data) {
      // Default initial reviews for demo
      const defaults: MockReview[] = [
        {
          id: "1",
          itemId: 1,
          userName: "Aminata B.",
          rating: 5,
          comment: "Le meilleur Thieb de Dakar !",
          createdAt: "18/04/2026 12:00",
        },
        {
          id: "2",
          itemId: 1,
          userName: "Moussa F.",
          rating: 4,
          comment: "Très copieux, un peu épicé.",
          createdAt: "18/04/2026 11:30",
        },
        {
          id: "3",
          itemId: 2,
          userName: "Ousseynou D.",
          rating: 5,
          comment: "Le burger est énorme, je recommande.",
          createdAt: "18/04/2026 10:45",
        },
      ];
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  },

  addReview(review: Omit<MockReview, "id" | "createdAt">) {
    const reviews = this.getReviews();
    const newReview: MockReview = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toLocaleString("fr-FR"),
    };
    reviews.unshift(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new Event("reviews_update"));
    return newReview;
  },

  getItemReviews(itemId: number): MockReview[] {
    return this.getReviews().filter((r) => r.itemId === itemId);
  },

  getAverageRating(itemId: number): number {
    const reviews = this.getItemReviews(itemId);
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  },

  subscribeToReviews(callback: (reviews: MockReview[]) => void) {
    const handler = () => callback(this.getReviews());
    window.addEventListener("reviews_update", handler);
    handler();
    return () => window.removeEventListener("reviews_update", handler);
  },
};

/**
 * DemoSimulation
 * Simule une activité de fond pour la démo (progression automatique des commandes).
 */
export const DemoSimulation = {
  interval: null as any,

  start() {
    if (this.interval) return;
    console.log("🚀 Demo Simulation Started");

    this.interval = setInterval(() => {
      const orders = MockOrderService.getOrders();
      let hasChanges = false;

      const updatedOrders = orders.map((order) => {
        // Progression automatique pour la démo
        if (order.status === "pending" && Math.random() > 0.7) {
          hasChanges = true;
          return { ...order, status: "preparing" as const };
        }
        if (order.status === "preparing" && Math.random() > 0.8) {
          hasChanges = true;
          return { ...order, status: "ready" as const };
        }
        return order;
      });

      if (hasChanges) {
        MockOrderService.saveOrders(updatedOrders);
      }
    }, 10000); // Toutes les 10 secondes
  },

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log("🛑 Demo Simulation Stopped");
    }
  },
};
