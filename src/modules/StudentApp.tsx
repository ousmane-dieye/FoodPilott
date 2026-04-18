import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  Search, 
  ShoppingBag, 
  QrCode, 
  Map as MapIcon, 
  Trophy, 
  MessageSquare, 
  User as UserIcon,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  AlertCircle,
  Star,
  Leaf,
  Utensils,
  Coffee,
  Sparkles,
  Calendar,
  LayoutGrid,
  Bell
} from "lucide-react";
import { cn } from "../lib/utils";
import { QRCodeSVG } from "qrcode.react";

// --- SUB-COMPONENTS ---

function StudentOrder() {
  const menuItems = [
    { id: '1', name: 'Yassa au Poulet', price: 2500, stock: 15, rating: 4.8, type: 'classic' },
    { id: '2', name: 'Thieboudienne Poisson', price: 3000, stock: 8, rating: 4.9, type: 'classic' },
    { id: '3', name: 'Salade de Quinoa Bio', price: 2000, stock: 20, rating: 4.5, type: 'veg', green: true },
    { id: '4', name: 'Burger Végé', price: 2200, stock: 12, rating: 4.6, type: 'veg' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-primary p-6 rounded-[32px] text-white shadow-xl shadow-primary/20 flex justify-between items-center overflow-hidden relative">
         <div className="relative z-10">
            <h3 className="font-black italic text-lg uppercase">Promo Express</h3>
            <p className="text-sm opacity-90">Sénégalais Bowl à -20% pour encore 14 min.</p>
         </div>
         <ShoppingBag size={48} className="opacity-20 -rotate-12 absolute -right-4 -bottom-4" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {['Tous', 'Végétarien', 'Anti-Gaspi', 'Desserts'].map(f => (
          <button key={f} className="whitespace-nowrap px-6 py-2 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:border-primary transition-all shadow-sm">
             {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex gap-4 items-center group active:scale-95 transition-all">
            <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 relative">
              <Utensils size={32} />
              {item.green && <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full"><Leaf size={14} /></div>}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <span className="text-primary font-black">{item.price} F</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold mt-1">
                <Star size={12} fill="currentColor" /> {item.rating}
              </div>
              <div className="mt-4 flex justify-between items-center">
                 <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.stock} dispo</span>
                 <button className="bg-gray-100 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    <Plus size={16} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentFidelity() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <p className="text-green-200 text-xs font-black uppercase tracking-[0.2em]">Votre Statut</p>
                   <h3 className="text-4xl font-black italic">AVANT-GARDE</h3>
                </div>
                <Trophy size={48} className="text-yellow-400" />
             </div>
             <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/10 p-0.5">
                   <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                </div>
                <p className="text-xs font-bold text-green-100 flex justify-between uppercase">
                   <span>1,500 PTS</span>
                   <span>Niveau OR à 2,000</span>
                </p>
             </div>
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
       </div>

       <h3 className="text-lg font-black uppercase italic tracking-tight">Récompenses Disponibles</h3>
       <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Café Offert', pts: 250, icon: Coffee },
            { label: 'Dessert Offert', pts: 600, icon: Utensils },
            { label: 'Accès VIP', pts: 1000, icon: Sparkles },
            { label: 'Repas Gratuit', pts: 2500, icon: Home },
          ].map(r => (
            <div key={r.label} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2 group hover:border-primary transition-all">
               <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform">
                  <r.icon size={24} />
               </div>
               <p className="font-bold text-sm">{r.label}</p>
               <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{r.pts} points</span>
            </div>
          ))}
       </div>
    </div>
  );
}

function StudentAI() {
  return (
    <div className="space-y-6 h-[700px] flex flex-col">
       <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
             <Sparkles size={24} />
          </div>
          <div>
             <h3 className="font-bold">Nutrition Assistant AI</h3>
             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Optimisé pour UNIFAC</p>
          </div>
       </div>
       <div className="flex-1 bg-gray-50/50 rounded-[40px] p-6 text-center flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-100">
          <Sparkles size={48} className="text-gray-200" />
          <p className="text-gray-400 font-medium italic">Posez une question sur l'équilibre de votre repas...</p>
          <div className="grid gap-2 w-full mt-8">
             {["Est-ce que le Yassa est équilibré ?", "Mon menu sans gluten du jour ?", "Calories du Thieb ?"].map(q => (
               <button key={q} className="bg-white border p-4 rounded-2xl text-xs font-bold text-gray-500 hover:border-primary hover:text-primary transition-all">{q}</button>
             ))}
          </div>
       </div>
       <div className="p-4 bg-white border border-gray-100 rounded-[32px] shadow-lg flex gap-2">
          <input className="flex-1 bg-transparent px-4 py-2 border-none outline-none text-sm font-medium" placeholder="Demander à l'assistant..." />
          <button className="bg-primary text-white p-3 rounded-2xl"><ChevronRight/></button>
       </div>
    </div>
  );
}

function StudentTables() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-black uppercase italic tracking-tight">Plan de Salle</h3>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live</span>
             </div>
          </div>
          <div className="grid grid-cols-5 gap-3">
             {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={cn(
                  "aspect-square rounded-2xl border flex items-center justify-center text-[10px] font-black transition-all",
                  i % 3 === 0 ? "bg-green-50 border-green-200 text-primary" : "bg-red-50 border-red-100 text-red-500"
                )}>
                   {i + 1}
                </div>
             ))}
          </div>
       </div>
       <div className="bg-black p-8 rounded-[32px] text-white flex justify-between items-center">
          <div>
             <h4 className="font-bold">Affluence : Moyenne</h4>
             <p className="text-xs text-gray-400 mt-1">Estimé : 5 min d'attente</p>
          </div>
          <Clock size={32} className="text-primary" />
       </div>
    </div>
  );
}

// --- MAIN MODULE ---

export default function StudentApp() {
  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
       <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex justify-between items-center sticky top-4 z-30 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-xl ring-1 ring-gray-100">
                <img src="https://picsum.photos/seed/moussa/100/100" alt="Avatar" referrerPolicy="no-referrer" />
             </div>
             <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Étudiant</p>
                <h2 className="font-black italic text-lg leading-none">Moussa Dieng</h2>
             </div>
          </div>
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
             <Bell size={20} />
          </div>
       </div>

       <div className="min-h-[600px]">
          <Routes>
             <Route path="order" element={<StudentOrder />} />
             <Route path="fidelity" element={<StudentFidelity />} />
             <Route path="ai" element={<StudentAI />} />
             <Route path="tables" element={<StudentTables />} />
             <Route path="reservations" element={<div className="p-20 text-center text-gray-400 italic">Mes réservations passées...</div>} />
             <Route path="antigaspi" element={<div className="p-20 text-center text-gray-400 italic">Bons plans anti-gaspi du jour...</div>} />
             <Route path="feedback" element={<div className="p-20 text-center text-gray-400 italic">Envoyer un avis...</div>} />
             <Route path="profile" element={<div className="p-20 text-center text-gray-400 italic">Mes paramètres profil...</div>} />
             <Route path="*" element={<Navigate to="order" replace />} />
          </Routes>
       </div>
    </div>
  );
}
