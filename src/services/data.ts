import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Review, 
  TimeSlot, 
  Reward, 
  InventoryItem, 
  Message, 
  UserProfile 
} from '../types';
import { handleFirestoreError } from '../lib/error-handler';
import { useAuthStore } from '../store/useAuthStore';

export const DataService = {
  // --- REVIEWS ---
  async getReviews(menuItemId: string): Promise<Review[]> {
    try {
      const q = query(
        collection(db, 'menuItems', menuItemId, 'reviews'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate()?.toLocaleDateString('fr-FR') || ''
        } as Review;
      });
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      return [];
    }
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>) {
    try {
      const newReview = {
        userId: review.userId,
        menuId: review.menuItemId,
        rating: review.rating,
        comment: review.comment || "",
        createdAt: Timestamp.now()
      };
      
      // Use subcollection /menuItems/{menuId}/reviews
      await addDoc(collection(db, 'menuItems', review.menuItemId, 'reviews'), newReview);
      
      // Note: updating menu average rating should theoretically be done in a Cloud Function
      // since students only have read access to menuItems.
    } catch (error) {
       handleFirestoreError(error, 'create', 'reviews');
    }
  },

  // --- TIME SLOTS ---
  async getTimeSlots(): Promise<TimeSlot[]> {
     const mockSlots: TimeSlot[] = [
       { id: '1', time: '12:00', affluence: 'high', description: 'Affluence élevée - temps d’attente long', bonusPoints: 0 },
       { id: '2', time: '12:30', affluence: 'medium', description: 'Affluence modérée - service standard', bonusPoints: 0 },
       { id: '3', time: '13:00', affluence: 'low', description: 'Heure calme - service rapide + bonus points', bonusPoints: 20 },
       { id: '4', time: '13:30', affluence: 'low', description: 'Heure calme - service rapide + bonus points', bonusPoints: 20 },
     ];
     // In a real app, this would come from a 'config' or 'status' collection updated by AI/Logic
     return mockSlots;
  },

  // --- REWARDS ---
  async getRewards(): Promise<Reward[]> {
    return [
      { id: '1', title: 'Café offert', pointsCost: 300, description: 'Un café chaud au choix', icon: 'Coffee' },
      { id: '2', title: 'Dessert offert', pointsCost: 400, description: 'Une pâtisserie du jour', icon: 'IceCream' },
      { id: '3', title: 'Priorité commande', pointsCost: 500, description: 'Votre prochaine commande passe en tête de liste', icon: 'Zap' },
    ];
  },

  async redeemReward(userId: string, reward: Reward) {
     try {
       const userRef = doc(db, 'users', userId);
       const userSnap = await getDoc(userRef);
       if (!userSnap.exists()) throw new Error("User not found");
       
       const points = userSnap.data().points || 0;
       if (points < reward.pointsCost) throw new Error("Points insuffisants");
       
       await updateDoc(userRef, {
         points: increment(-reward.pointsCost)
       });
       
       // Log the redemption
       await addDoc(collection(db, 'redemptions'), {
         userId,
         rewardId: reward.id,
         rewardTitle: reward.title,
         pointsSpent: reward.pointsCost,
         createdAt: Timestamp.now(),
         status: 'pending'
       });
       
       return true;
     } catch (error) {
       handleFirestoreError(error, 'update', 'users');
       throw error;
     }
  },

  // --- INVENTORY ---
  subscribeToInventory(callback: (items: InventoryItem[]) => void) {
    return onSnapshot(collection(db, 'inventory'), (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem)));
    });
  },

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
    try {
      const ref = doc(db, 'inventory', id);
      await updateDoc(ref, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, 'update', 'inventory');
    }
  },

  async addInventoryItem(item: Omit<InventoryItem, 'id' | 'updatedAt'>) {
    try {
      await addDoc(collection(db, 'inventory'), {
        ...item,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, 'create', 'inventory');
    }
  },

  // --- MESSAGES (Kitchen Comm) ---
  subscribeToMessages(callback: (messages: Message[]) => void) {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
    });
  },

  async sendMessage(msg: Omit<Message, 'id' | 'createdAt'>) {
    try {
      await addDoc(collection(db, 'messages'), {
        ...msg,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      handleFirestoreError(error, 'create', 'messages');
    }
  },

  // --- ORDERS ---
  subscribeToMyOrders(userId: string, callback: (orders: any[]) => void) {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate()?.toLocaleString('fr-FR')
        };
      }));
    });
  }
};
