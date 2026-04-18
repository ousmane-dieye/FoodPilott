import { 
  collection, 
  updateDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus } from '../types';
import { handleFirestoreError } from '../lib/error-handler';
import { useAuthStore } from '../store/useAuthStore';
import { MOCK_ORDERS } from '../mocks/orders';
import { api } from '../lib/api';

const COLLECTION = 'orders';

// Demo local state to simulate persistence in a single session
let demoOrders = [...MOCK_ORDERS];

export const OrderService = {
  async placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    if (useAuthStore.getState().isDemoMode) {
      const newOrder: Order = {
        ...order,
        id: "o_" + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      demoOrders = [newOrder, ...demoOrders];
      return { id: newOrder.id };
    }
    
    // PRODUCTION: Use Secure Backend API (Security Pillar 9)
    try {
      const response = await api.post('/api/orders', {
        items: order.items,
        slot: order.slot,
        tableId: order.tableId
      });
      return await response.json();
    } catch (error) {
      console.error("Order placement failed:", error);
      throw error;
    }
  },

  subscribeToUserOrders(userId: string, callback: (orders: Order[]) => void) {
    if (useAuthStore.getState().isDemoMode) {
      callback(demoOrders.filter(o => o.userId === userId));
      return () => {};
    }
    const q = query(
      collection(db, COLLECTION), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      callback(orders.length > 0 ? orders : demoOrders.filter(o => o.userId === userId));
    }, (error) => {
      handleFirestoreError(error, 'list', COLLECTION);
    });
  },

  subscribeToKitchenQueue(callback: (orders: Order[]) => void) {
    if (useAuthStore.getState().isDemoMode) {
      callback(demoOrders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)));
      return () => {};
    }
    const q = query(
      collection(db, COLLECTION), 
      where('status', 'in', ['pending', 'preparing', 'ready']),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, (snap) => {
      const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      callback(orders.length > 0 ? orders : demoOrders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)));
    }, (error) => {
      handleFirestoreError(error, 'list', COLLECTION);
    });
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    if (useAuthStore.getState().isDemoMode) {
      demoOrders = demoOrders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);
      return;
    }
    try {
      const ref = doc(db, COLLECTION, orderId);
      await updateDoc(ref, { 
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, 'update', `${COLLECTION}/${orderId}`);
    }
  }
};
