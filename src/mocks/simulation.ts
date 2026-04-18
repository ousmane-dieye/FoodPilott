export const MOCK_STOCK = [
  { item: "Riz", quantity: 50, unit: "kg", threshold: 10, status: "OK" },
  { item: "Poulet", quantity: 30, unit: "unités", threshold: 12, status: "OK" },
  { item: "Poisson", quantity: 20, unit: "kg", threshold: 8, status: "OK" },
  { item: "Bissap", quantity: 100, unit: "boissons", threshold: 25, status: "OK" },
  { item: "Légumes", quantity: 5, unit: "kg", threshold: 12, status: "LOW" },
  { item: "Pain", quantity: 15, unit: "baguettes", threshold: 20, status: "LOW" }
];

export const MOCK_TABLES = Array.from({ length: 30 }, (_, i) => ({
  id: `t${i + 1}`,
  number: i + 1,
  status: ['libre', 'occupée', 'réservée'][Math.floor(Math.random() * 3)],
  seats: 4
}));

export const MOCK_NOTIFICATIONS = [
  { 
    id: "n1",
    title: "Commande prête",
    body: "Votre Thieboudienne (o3) vous attend au comptoir.",
    type: "info",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  { 
    id: "n2",
    title: "Stock Faible",
    body: "Le stock de 'Légumes' est passé sous le seuil d'alerte.",
    type: "alert",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  { 
    id: "n3",
    title: "Allo Chef ?",
    body: "15 nouveaux commandes reçues en moins de 10 min !",
    type: "info",
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
];

export const MOCK_RESERVATIONS = [
  { id: "r1", userId: "demo_student", tableId: "t5", time: "12:30", status: "confirmed" },
  { id: "r2", userId: "st_9", tableId: "t12", time: "13:00", status: "pending" },
  { id: "r3", userId: "st_14", tableId: "t3", time: "12:15", status: "confirmed" }
];

export const MOCK_WASTE_MEALS = [
  { 
    id: "w1", 
    name: "Couscous Royal (Anti-Gaspi)", 
    description: "Portion généreuse de couscous du midi, prix réduit pour éviter le gaspillage.",
    price: 1500,
    originalPrice: 3500,
    available: 3,
    imageUrl: "https://picsum.photos/seed/couscous/400/300"
  },
  { 
    id: "w2", 
    name: "Dibi Agneau (Anti-Gaspi)", 
    description: "Fin de service grillades, encore chaud et délicieux.",
    price: 2000,
    originalPrice: 4500,
    available: 2,
    imageUrl: "https://picsum.photos/seed/dibi2/400/300"
  }
];

export const MOCK_KPIS = {
  covers: { value: 842, trend: "+12%", up: true },
  reservations: { value: 312, trend: "+5%", up: true },
  wasteSaved: { value: "42.5kg", trend: "+18%", up: true },
  satisfaction: { value: "4.8/5", trend: "-2%", up: false }
};

export const MOCK_FORECASTS = {
  nextSlot: "12:30",
  estimatedCovers: 240,
  trend: "up",
  aiTip: "L'IA suggère d'anticiper 15% de flux supplémentaire sur les plats sénégalais."
};
