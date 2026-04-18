import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { MenuService } from '../services/menu';

export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = MenuService.subscribeToMenu((newItems) => {
      setItems(newItems);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { items, loading };
}
