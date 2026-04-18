import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { 
  Users, 
  Trash2, 
  Smile, 
  Calendar, 
  Package, 
  ChevronRight, 
  Plus, 
  FileText,
  Settings,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  MessageSquare,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Leaf,
  LayoutGrid,
  Trophy,
  Utensils,
  X,
  Save,
  Edit2
} from "lucide-react";
import { cn } from "../lib/utils";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

// Services & Hooks
import { MenuService } from "../services/menu";
import { useMenu } from "../hooks/useMenu";
import { MenuItem } from "../types";
import { useAuthStore } from "../store/useAuthStore";
import { MOCK_STOCK, MOCK_KPIS } from "../mocks/simulation";

// --- SUB-COMPONENTS ---

function AdminStats() {
  const { isDemoMode } = useAuthStore();
  
  const stats = isDemoMode ? [
    { label: 'Couverts', value: MOCK_KPIS.covers.value.toString(), trend: MOCK_KPIS.covers.trend, up: MOCK_KPIS.covers.up, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Réservations', value: MOCK_KPIS.reservations.value.toString(), trend: MOCK_KPIS.reservations.trend, up: MOCK_KPIS.reservations.up, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Gaspillage Évité', value: MOCK_KPIS.wasteSaved.value, trend: MOCK_KPIS.wasteSaved.trend, up: MOCK_KPIS.wasteSaved.up, icon: Trash2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Satisfaction', value: MOCK_KPIS.satisfaction.value, trend: MOCK_KPIS.satisfaction.trend, up: MOCK_KPIS.satisfaction.up, icon: Smile, color: 'text-orange-600', bg: 'bg-orange-50' },
  ] : [
    { label: 'Couverts', value: '42', trend: '0%', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Réservations', value: '12', trend: '0%', up: true, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Gaspillage Évité', value: '0kg', trend: '0%', up: true, icon: Trash2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Satisfaction', value: '5/5', trend: '0%', up: true, icon: Smile, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const salesData = [
    { name: 'Lun', value: 400 },
    { name: 'Mar', value: 300 },
    { name: 'Mer', value: 600 },
    { name: 'Jeu', value: 800 },
    { name: 'Ven', value: 500 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl", kpi.bg, kpi.color)}>
                <kpi.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                kpi.up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.trend}
              </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{kpi.label}</p>
            <p className="text-3xl font-black mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <h3 className="text-xl font-black italic uppercase tracking-tight mb-8">Performance Hebdomadaire</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A86B" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#00A86B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" fontSize={11} stroke="#9CA3AF" />
              <YAxis fontSize={11} stroke="#9CA3AF" />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="value" stroke="#00A86B" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MenuModal({ item, onClose }: { item?: MenuItem | null, onClose: () => void }) {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>(item || {
    name: '',
    description: '',
    price: 0,
    category: 'Sénégalais',
    stock: 50,
    green: false,
    allergens: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (item?.id) {
        await MenuService.updateMenuItem(item.id, formData);
        toast.success("Plat mis à jour");
      } else {
        await MenuService.addMenuItem(formData);
        toast.success("Plat ajouté au menu");
      }
      onClose();
    } catch (error) {
      toast.error("Erreur d'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[48px] w-full max-w-xl p-10 shadow-2xl space-y-8"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black italic uppercase tracking-tight">{item ? 'Éditer Plat' : 'Nouveau Plat'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 px-1">Nom du plat</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 px-1">Prix (F)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20" />
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-xs font-black uppercase text-gray-400 px-1">Description</label>
             <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 h-24 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 px-1">Catégorie</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20">
                   <option>Sénégalais</option>
                   <option>Veggie</option>
                   <option>Classic</option>
                   <option>Dessert</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 px-1">Stock Initial</label>
                <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20" />
             </div>
          </div>
          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-[40px] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : <><Save size={20}/> Valider</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function AdminMenu() {
  const { items, loading } = useMenu();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null | undefined>(undefined);

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce plat de la carte ?")) {
      try {
        await MenuService.deleteMenuItem(id);
        toast.success("Plat retiré");
      } catch (e) {
        toast.error("Erreur de suppression");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tight uppercase italic">Gestion du Menu</h2>
        <button 
          onClick={() => setSelectedItem(null)}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          <Plus size={18} /> Nouveau Plat
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] animate-pulse">Syncing Database...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
              <tr>
                <th className="px-8 py-6">Plat</th>
                <th className="px-6 py-6">Catégorie</th>
                <th className="px-6 py-6">Prix</th>
                <th className="px-6 py-6">Stock</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(d => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-gray-900">{d.name}</td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">{d.category}</td>
                  <td className="px-6 py-5 font-black text-primary italic">{d.price} F</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      d.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}>
                      {d.stock} dispo
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedItem(d)} className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-primary hover:text-white transition-all"><Edit2 size={16}/></button>
                        <button onClick={() => handleDelete(d.id)} className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {selectedItem !== undefined && <MenuModal item={selectedItem} onClose={() => setSelectedItem(undefined)} />}
      </AnimatePresence>
    </div>
  );
}

function AdminStock() {
  const { items: menuItems } = useMenu();
  const { isDemoMode } = useAuthStore();
  
  const displayStock = isDemoMode ? MOCK_STOCK : menuItems.map(m => ({
    item: m.name,
    quantity: m.stock,
    unit: 'portions',
    threshold: 10,
    status: m.stock > 10 ? 'OK' : 'LOW'
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black tracking-tight uppercase italic text-gray-900 leading-none">Inventaire & Stocks</h2>
         <div className="flex gap-2">
            <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-colors"><Filter size={18}/></button>
            <button className="bg-black text-white px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Commander</button>
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayStock.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
             <div className={cn("absolute top-0 left-0 w-1.5 h-full", s.status === 'OK' ? 'bg-green-500' : 'bg-red-500')} />
             <div className="flex justify-between mb-4">
                <Package className="text-gray-400" size={24} />
                <MoreVertical className="text-gray-200 group-hover:text-gray-400 transition-colors" />
             </div>
             <h4 className="font-bold text-lg mb-1">{s.item}</h4>
             <div className="flex justify-between items-end mt-4">
                <div>
                   <p className="text-2xl font-black italic">{s.quantity}</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.unit}</p>
                </div>
                <span className={cn(
                  "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                   s.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}>
                   {s.status}
                </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminAI() {
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt) return;
    setLoading(true);
    const newChat = [...chat, { role: "user", content: prompt }];
    setChat(newChat);
    setPrompt("");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "Tu es FoodPilot AI, l'assistant expert en gestion de restauration universitaire pour l'ESMT Dakar. Aide l'administrateur à optimiser son menu, ses stocks et à réduire le gaspillage. Réponds de façon concise et professionnelle."
        }
      });
      
      setChat([...newChat, { role: "ai", content: response.text || "Pas de réponse de l'IA." }]);
    } catch (e) {
      console.error(e);
      setChat([...newChat, { role: "ai", content: "Désolé, l'assistant IA est temporairement indisponible. Veuillez vérifier votre clé API." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col h-[600px] bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b bg-gray-50/50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 transition-transform hover:rotate-6">
                 <Sparkles size={24} />
              </div>
              <div>
                 <h3 className="font-black italic text-lg uppercase tracking-tight leading-none">FoodPilot Assistant</h3>
                 <p className="text-[10px] text-primary uppercase font-black mt-1 tracking-widest flex items-center gap-1">
                   <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                   Analyse active
                 </p>
              </div>
           </div>
           <Settings size={20} className="text-gray-300 hover:text-gray-600 transition-colors cursor-pointer" />
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
           {chat.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200">
                  <MessageSquare size={40} />
                </div>
                <div>
                   <p className="text-gray-900 font-black italic uppercase text-lg">Comment optimiser vos ventes ?</p>
                   <p className="text-gray-400 font-medium text-sm mt-1">Posez une question sur vos ventes, stocks ou suggestions de menu.</p>
                </div>
             </div>
           )}
           {chat.map((c, i) => (
             <div key={i} className={cn(
               "max-w-[85%] p-5 rounded-[32px] text-sm leading-relaxed shadow-sm",
               c.role === 'user' ? 'bg-primary text-white ml-auto rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-50'
             )}>
                {c.content}
             </div>
           ))}
           {loading && (
             <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <motion.div key={i} animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 0.6, delay: i*0.1 }} className="w-2 h-2 bg-primary/30 rounded-full" />
                ))}
             </div>
           )}
        </div>
        <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
           <input 
             value={prompt} 
             onChange={(e) => setPrompt(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
             placeholder="Analyse les tendances de la semaine..." 
             className="flex-1 bg-gray-50 px-8 py-4 rounded-3xl border-none focus:ring-2 focus:ring-primary/20 font-bold text-sm tracking-tight"
           />
           <button onClick={handleSend} className="bg-primary text-white p-5 rounded-3xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <ChevronRight size={24} />
           </button>
        </div>
      </div>
      <div className="space-y-6">
         <div className="bg-primary p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Insights Strategiques</h4>
            <p className="text-xl font-black italic leading-tight">Augmentation de 25% <br/> des plats VG le mercredi.</p>
            <p className="text-xs opacity-70 mt-3 font-medium">L'IA suggère d'élargir le menu Veggie.</p>
            <button className="mt-8 w-full bg-white text-primary font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-black/5 active:scale-95 transition-all">Appliquer le plan</button>
         </div>
      </div>
    </div>
  );
}

function AdminAntiGaspi() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black tracking-tight uppercase italic">Zero-Waste Engine</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-12 rounded-[56px] border border-gray-100 shadow-sm flex flex-col items-center text-center justify-center border-dashed border-2 group hover:border-primary transition-all cursor-pointer">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-[32px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <Leaf size={40} />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tight">Boost Anti-Gaspi</h3>
            <p className="text-gray-400 text-sm mb-8 font-medium italic">Automatisez les réductions de fin de service.</p>
            <button className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 active:scale-95 transition-all">
               Programmer une Offre
            </button>
         </div>
         <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm">
            <h3 className="font-black italic text-lg mb-8 uppercase tracking-tight">Impact Environnemental</h3>
            <div className="space-y-8">
               {[
                 { label: 'Repas sauvés', value: '1,420', color: 'bg-green-500' },
                 { label: 'CO2 réduit', value: '450kg', color: 'bg-blue-500' },
                 { label: 'Efficacité', value: '94%', color: 'bg-orange-500' },
               ].map(s => (
                 <div key={s.label} className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                       <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{s.label}</span>
                       <span className="text-lg font-black italic">{s.value}</span>
                    </div>
                    <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                       <motion.div initial={{ width: 0 }} animate={{ width: s.value.includes('%') ? s.value : '80%' }} className={cn("h-full rounded-full", s.color)} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

// --- MAIN MODULE ---

export default function AdminDashboard() {
  return (
    <div className="space-y-8 pb-12 font-sans">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
             <p className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2 italic">Backoffice ESMT</p>
             <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none uppercase italic">Chef Dashboard</h2>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all font-mono shadow-sm">
                <FileText size={16} /> SYSTEM LOGS
             </button>
             <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">
                <ShieldCheck size={16} /> SECURE AUDIT
             </button>
          </div>
       </div>

       <div className="min-h-[600px] animate-in fade-in duration-700">
          <Routes>
             <Route path="stats" element={<AdminStats />} />
             <Route path="menu" element={<AdminMenu />} />
             <Route path="stock" element={<AdminStock />} />
             <Route path="ai" element={<AdminAI />} />
             <Route path="antigaspi" element={<AdminAntiGaspi />} />
             <Route path="reservations" element={<div className="p-20 text-center italic text-gray-400 font-bold uppercase tracking-widest text-xs">Gestion des Réservations...</div>} />
             <Route path="orders" element={<div className="p-20 text-center italic text-gray-400 font-bold uppercase tracking-widest text-xs">Flux des Commandes...</div>} />
             <Route path="kitchen" element={<div className="p-20 text-center italic text-gray-400 font-bold uppercase tracking-widest text-xs">Pilotage Temps Réel Cuisine...</div>} />
             <Route path="tables" element={<div className="p-20 text-center italic text-gray-400 font-bold uppercase tracking-widest text-xs">Plan de Salle Dynamique...</div>} />
             <Route path="fidelity" element={<div className="p-20 text-center italic text-gray-400 font-bold uppercase tracking-widest text-xs">Programmes de Fidélité...</div>} />
             <Route path="feedback" element={<div className="p-20 text-center italic text-gray-400 font-bold uppercase tracking-widest text-xs">Feedback & Support...</div>} />
             <Route path="profile" element={<div className="p-20 text-center italic text-gray-400 font-bold uppercase tracking-widest text-xs">Paramètres du Profil...</div>} />
             <Route path="*" element={<Navigate to="stats" replace />} />
          </Routes>
       </div>
    </div>
  );
}
