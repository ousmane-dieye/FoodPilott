import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChefHat, 
  TrendingUp, 
  MessageCircle, 
  Package,
  Zap,
  FileText,
  Utensils,
  Sparkles,
  ShoppingBag,
  Bell,
  Search,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from 'sonner';

// Services & Hooks
import { useKitchenQueue } from "../hooks/useOrders";
import { useMenu } from "../hooks/useMenu";
import { OrderService } from "../services/orders";
import { OrderStatus } from "../types";

import { MOCK_FORECASTS } from "../mocks/simulation";
import { useAuthStore } from "../store/useAuthStore";

// --- SUB-COMPONENTS ---

function KitchenOps() {
  const { orders, loading } = useKitchenQueue();
  const { isDemoMode } = useAuthStore();
  const forecasts = isDemoMode ? MOCK_FORECASTS : {
    nextSlot: "En attente",
    estimatedCovers: 0,
    trend: "stable",
    aiTip: "Le flux est actuellement calme. Profitez-en pour préparer les stocks."
  };

  const handleStatusUpdate = async (id: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'preparing';
    if (currentStatus === 'pending') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'completed';

    try {
      await OrderService.updateOrderStatus(id, nextStatus);
      toast.success(`Ticket #${id.slice(-4)} mis à jour`);
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-400 font-black uppercase text-xs animate-pulse">Synchronisation de la cuisine...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-black italic lowercase tracking-tight mb-6">File de production</h3>
        
        {orders.length === 0 ? (
          <div className="bg-white p-20 rounded-[48px] border-2 border-dashed border-gray-100 text-center space-y-4">
             <ShoppingBag size={48} className="text-gray-100 mx-auto" />
             <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Aucune commande en attente</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {orders.map((order) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={order.id}
                  className={cn(
                    "bg-white p-6 rounded-[32px] border-2 flex items-center justify-between gap-4 transition-all shadow-sm",
                    order.status === 'preparing' ? "border-blue-500 shadow-xl shadow-blue-50" : 
                    order.status === 'ready' ? "border-green-500 shadow-xl shadow-green-50" :
                    "border-gray-50 hover:border-gray-100"
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs", 
                      order.status === 'preparing' ? "bg-blue-500 text-white" : 
                      order.status === 'ready' ? "bg-green-500 text-white" :
                      "bg-gray-100 text-gray-400"
                    )}>
                      #{order.id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex flex-col">
                        {order.items.map((item, idx) => (
                          <h4 key={idx} className="font-bold text-gray-900 text-lg">
                            {item.quantity}x {item.name}
                          </h4>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{order.slot}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStatusUpdate(order.id, order.status)}
                    className={cn(
                      "px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95",
                      order.status === 'pending' ? "bg-blue-500 text-white shadow-blue-100" : 
                      order.status === 'preparing' ? "bg-green-500 text-white shadow-green-100" :
                      "bg-primary text-white"
                    )}
                  >
                    {order.status === 'pending' ? 'Démarrer' : 
                     order.status === 'preparing' ? 'Prêt' : 'Servir'}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
         <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
            <h3 className="font-black italic lowercase tracking-tight mb-4 flex items-center gap-2">
               <Zap size={20} className="text-primary fill-primary" />
               Prévisions {forecasts.nextSlot}
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <div>
                     <p className="text-3xl font-black">{forecasts.estimatedCovers}</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Couvertures prévues</p>
                  </div>
                  <TrendingUp className={cn(forecasts.trend === 'up' ? "text-green-500" : "text-gray-400", "mb-2")} size={24} />
               </div>
               <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3" />
               </div>
               <p className="text-[11px] text-gray-400 leading-relaxed font-medium italic">{forecasts.aiTip}</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function KitchenMenu() {
  const { items, loading } = useMenu();

  if (loading) return <div className="p-20 text-center text-gray-400 font-black uppercase text-xs animate-pulse">Sync menu...</div>;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 uppercase italic">Menu Actif</h2>
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Service Ouvert</span>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
               <div className="w-full h-40 bg-gray-50 rounded-2xl mb-4 relative overflow-hidden">
                  <Utensils className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-200 group-hover:scale-110 transition-transform" size={40} />
               </div>
               <h4 className="font-bold text-lg">{item.name}</h4>
               <p className="text-sm text-gray-400 font-medium italic mb-2">Stock dispo : <b className="text-gray-900 font-black tracking-tighter">{item.stock}</b></p>
               <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-gray-50 text-gray-500 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Recette</button>
                  <button className="flex-1 bg-gray-50 text-gray-500 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Tech Sheet</button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}

// --- MAIN MODULE ---

export default function KitchenApp() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
         <div>
            <p className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-1 italic">Kitchen Operations</p>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none uppercase italic">Chef Console</h2>
         </div>
         <div className="flex gap-2 font-mono">
            <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-xl text-xs font-bold text-gray-500">
               <Clock size={14} /> LIVE SYNC
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-bold ring-1 ring-green-100">
               <CheckCircle2 size={14} /> OPERATIONAL
            </div>
         </div>
      </div>

      <div className="min-h-[500px]">
         <Routes>
            <Route path="ops" element={<KitchenOps />} />
            <Route path="menu" element={<KitchenMenu />} />
            <Route path="*" element={<Navigate to="ops" replace />} />
         </Routes>
      </div>
    </div>
  );
}
