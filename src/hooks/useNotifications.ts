import { useState, useEffect } from "react";
import { MOCK_NOTIFICATIONS } from "../mocks/simulation";
import { useAuthStore } from "../store/useAuthStore";

export function useNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const isDemo = useAuthStore(s => s.isDemoMode);

  useEffect(() => {
    // In real mode, this would subscribe to Firestore 'notifications' collection
    if (!isDemo) return;

    // Simulate new notification every few minutes
    const interval = setInterval(() => {
      const newNotif = {
        id: "n_" + Math.random().toString(36).substr(2, 9),
        title: "Nouvelle Alerte",
        body: "Un nouvel événement vient de se produire.",
        type: "info",
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }, 120000);

    return () => clearInterval(interval);
  }, [isDemo]);

  return { notifications };
}
