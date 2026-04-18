import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { MenuItem } from "../types";
import { handleFirestoreError } from "../lib/error-handler";
import { useAuthStore } from "../store/useAuthStore";
import { MOCK_MENU } from "../mocks/menu";

const COLLECTION = "menus";

export const MenuService = {
  async getMenuItems(): Promise<MenuItem[]> {
    if (useAuthStore.getState().isDemoMode) {
      return MOCK_MENU;
    }
    try {
      const snap = await getDocs(collection(db, COLLECTION));
      const items = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as MenuItem,
      );
      return items.length > 0 ? items : MOCK_MENU; // Fallback to mocks if DB empty
    } catch (error) {
      handleFirestoreError(error, "list", COLLECTION);
      return MOCK_MENU;
    }
  },

  subscribeToMenu(callback: (items: MenuItem[]) => void) {
    if (useAuthStore.getState().isDemoMode) {
      callback(MOCK_MENU);
      return () => {};
    }
    return onSnapshot(
      collection(db, COLLECTION),
      (snap) => {
        const items = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as MenuItem,
        );
        callback(items.length > 0 ? items : MOCK_MENU);
      },
      (error) => {
        handleFirestoreError(error, "list", COLLECTION);
      },
    );
  },

  async addMenuItem(item: Omit<MenuItem, "id">) {
    try {
      return await addDoc(collection(db, COLLECTION), item);
    } catch (error) {
      handleFirestoreError(error, "create", COLLECTION);
    }
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>) {
    try {
      const ref = doc(db, COLLECTION, id);
      await updateDoc(ref, updates);
    } catch (error) {
      handleFirestoreError(error, "update", `${COLLECTION}/${id}`);
    }
  },

  async deleteMenuItem(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTION, id));
    } catch (error) {
      handleFirestoreError(error, "delete", `${COLLECTION}/${id}`);
    }
  },
};
