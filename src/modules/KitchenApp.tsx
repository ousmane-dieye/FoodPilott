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

// --- SUB-COMPONENTS ---

function KitchenOps() {
  const [orders, setOrders] = useState([
    { id: '101', name: 'Yassa au Poulet', slot: '12:15', status: 'preparing', priority: true },
    { id: '102', name: 'Thieboudienne Poisson', slot: '12:15', status: 'pending', priority: false },
    { id: '103', name: 'Burger Végé', slot: '12:30', status: 'pending', priority: false },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-black italic lowercase tracking-tight mb-6">File de production</h3>
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div 
              layout
              key={order.id}
              className={cn(
                "bg-white p-6 rounded-[32px] border-2 flex items-center justify-between gap-4 transition-all",
                order.status === 'preparing' ? "border-blue-500 shadow-xl shadow-blue-50" : "border-gray-50 hover:border-gray-100"
              )}
            >
              <div className="flex items-center gap-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg", order.status === 'preparing' ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400")}>
                  {order.id}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{order.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{order.slot}</span>
                    {order.priority && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1"><AlertTriangle size={10}/> Prioritaire</span>}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => updateStatus(order.id, order.status === 'pending' ? 'preparing' : 'ready')}
                className={cn(
                  "px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-black/5 active:scale-95",
                  order.status === 'pending' ? "bg-blue-500 text-white" : "bg-primary text-white"
                )}
              >
                {order.status === 'pending' ? 'Démarrer' : 'Prêt'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
         <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
            <h3 className="font-black italic lowercase tracking-tight mb-4 flex items-center gap-2">
               <Zap size={20} className="text-primary fill-primary" />
               Prévisions 12:30
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <div>
                     <p className="text-3xl font-black">240</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Couvertures prévues</p>
                  </div>
                  <TrendingUp className="text-green-500 mb-2" size={24} />
               </div>
               <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3" />
               </div>
               <p className="text-[11px] text-gray-400 leading-relaxed font-medium">L'IA suggère de préparer <b className="text-gray-900">45 portions supplémentaires</b> de riz basmati d'ici 12:45.</p>
            </div>
         </div>
         <div className="bg-orange-500 p-8 rounded-[48px] text-white shadow-xl shadow-orange-100 group overflow-hidden relative">
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
             <ChefHat className="mb-4 opacity-50 group-hover:rotate-12 transition-transform" size={40} />
             <h4 className="font-black text-xl leading-tight">Alerte Stocks</h4>
             <p className="text-sm opacity-90 mt-2 font-medium italic">Poulet Fermier : <br/>Plus que 15 portions disponibles.</p>
             <button className="mt-6 w-full bg-white text-orange-500 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest">Gérer Stock</button>
         </div>
      </div>
    </div>
  );
}

function KitchenMenu() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 uppercase italic">Menu du Jour</h2>
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Service Ouvert</span>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Mafé Boeuf', 'Salade César UNIFAC', 'Poisson Grillé', 'Sénégalais Bowl'].map(name => (
            <div key={name} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
               <div className="w-full h-40 bg-gray-50 rounded-2xl mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <Utensils className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-200 group-hover:scale-110 transition-transform" size={40} />
               </div>
               <h4 className="font-bold text-lg">{name}</h4>
               <p className="text-sm text-gray-400 font-medium italic">Plat du jour - 2500 F</p>
               <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-gray-50 text-gray-500 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Recette</button>
                  <button className="flex-1 bg-gray-50 text-gray-500 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Tech Sheet</button>
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
               <Clock size={14} /> 12:05:45
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-bold ring-1 ring-green-100">
               <CheckCircle2 size={14} /> SYNC OK
            </div>
         </div>
      </div>

      <div className="min-h-[500px]">
         <Routes>
            <Route path="ops" element={<KitchenOps />} />
            <Route path="menu" element={<KitchenMenu />} />
            <Route path="orders" element={<div className="p-20 text-center text-gray-400 italic">Historique des commandes...</div>} />
            <Route path="ai" element={<div className="p-20 text-center text-gray-400 italic">Assistant Recettes IA...</div>} />
            <Route path="stock" element={<div className="p-20 text-center text-gray-400 italic">Alertes Stocks & Commandes...</div>} />
            <Route path="notifications" element={<div className="p-20 text-center text-gray-400 italic">Notifications de service...</div>} />
            <Route path="profile" element={<div className="p-20 text-center text-gray-400 italic">Profil du Chef...</div>} />
            <Route path="*" element={<Navigate to="ops" replace />} />
         </Routes>
      </div>
    </div>
  );
}
