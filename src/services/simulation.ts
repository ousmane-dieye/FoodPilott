import { OrderService } from "./orders";
import { useAuthStore } from "../store/useAuthStore";
import { OrderStatus } from "../types";

export const DemoSimulation = {
  intervalId: null as any,

  start() {
    if (this.intervalId) return;

    console.log("🚀 Lancement de la simulation FoodPilot...");

    this.intervalId = setInterval(() => {
      const isDemo = useAuthStore.getState().isDemoMode;
      if (!isDemo) return;

      // Logic: Randomly transition order status
      OrderService.subscribeToKitchenQueue((orders) => {
        if (orders.length === 0) return;

        // Pick a random order to advance
        const randomOrder = orders[Math.floor(Math.random() * orders.length)];
        let nextStatus: OrderStatus | null = null;

        if (randomOrder.status === 'pending') nextStatus = 'preparing';
        else if (randomOrder.status === 'preparing') nextStatus = 'ready';
        else if (randomOrder.status === 'ready') nextStatus = 'completed';

        if (nextStatus) {
          console.log(`[Simulation] Mise à jour commande ${randomOrder.id}: ${randomOrder.status} -> ${nextStatus}`);
          OrderService.updateOrderStatus(randomOrder.id, nextStatus);
        }
      });
    }, 15000); // Every 15 seconds
  },

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
};
