import { useState, useEffect } from "react";
import { Order } from "../types";
import { OrderService } from "../services/orders";
import { useAuthStore } from "../store/useAuthStore";

export function useUserOrders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = OrderService.subscribeToUserOrders(
      user.uid,
      (newOrders) => {
        setOrders(newOrders);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [user]);

  return { orders, loading };
}

export function useKitchenQueue() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = OrderService.subscribeToKitchenQueue((newOrders) => {
      setOrders(newOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { orders, loading };
}
