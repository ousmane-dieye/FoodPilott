import { useState, useEffect } from "react";
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
  Utensils
} from "lucide-react";
import { cn } from "../lib/utils";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// --- SUB-COMPONENTS ---

function AdminStats() {
  const kpis = [
    { label: 'Couverts', value: '842', trend: '+12%', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Réservations', value: '312', trend: '+5%', up: true, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Gaspillage Évité', value: '42.5kg', trend: '+18%', up: true, icon: Trash2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Satisfaction', value: '4.8/5', trend: '-2%', up: false, icon: Smile, color: 'text-orange-600', bg: 'bg-orange-50' },
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
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
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

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold mb-8">Performance Hebdomadaire</h3>
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

function AdminMenu() {
  const dishes = [
    { id: 1, name: 'Yassa au Poulet', cat: 'Classic', price: 2500, status: 'Active' },
    { id: 2, name: 'Thieboudienne', cat: 'Classic', price: 3000, status: 'Active' },
    { id: 3, name: 'Salade Bio', cat: 'Veggie', price: 1800, status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tight">Gestion du Menu</h2>
        <button className="bg-primary text-white px-6 py-2 rounded-2xl font-bold flex items-center gap-2">
          <Plus size={18} /> Nouveau Plat
        </button>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">Plat</th>
              <th className="px-6 py-4">Catégorie</th>
              <th className="px-6 py-4">Prix</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {dishes.map(d => (
              <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold">{d.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{d.cat}</td>
                <td className="px-6 py-4 font-bold text-primary">{d.price} F</td>
                <td className="px-6 py-4">
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", d.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400')}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right italic text-gray-400 text-xs">Éditer / Supprimer</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminStock() {
  const stockItems = [
    { name: 'Riz Basmati', qty: '120kg', status: 'OK', color: 'bg-green-500' },
    { name: 'Poulet Fermier', qty: '15kg', status: 'CRITIQUE', color: 'bg-red-500' },
    { name: 'Oignons', qty: '45kg', status: 'FAIBLE', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black tracking-tight">Inventaire & Stocks</h2>
         <div className="flex gap-2">
            <button className="p-2 bg-white border rounded-xl"><Filter size={18}/></button>
            <button className="bg-black text-white px-6 py-2 rounded-2xl font-bold">Commander</button>
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stockItems.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
             <div className={cn("absolute top-0 left-0 w-1 h-full", item.color)} />
             <div className="flex justify-between mb-4">
                <Package className="text-gray-400" />
                <MoreVertical className="text-gray-300" />
             </div>
             <h4 className="font-bold text-lg mb-1">{item.name}</h4>
             <div className="flex justify-between items-end">
                <p className="text-2xl font-black">{item.qty}</p>
                <span className={cn("text-[9px] font-black px-2 py-1 rounded-lg", item.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                   {item.status}
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: "Tu es FoodPilot AI, l'assistant expert en gestion de restauration. Aide l'administrateur à optimiser son menu, ses stocks et à réduire le gaspillage."
        }
      });
      setChat([...newChat, { role: "ai", content: response.text || "Désolé, j'ai rencontré une erreur." }]);
    } catch (e) {
      setChat([...newChat, { role: "ai", content: "Erreur de connexion à l'IA." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col h-[600px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                 <Sparkles size={20} />
              </div>
              <div>
                 <h3 className="font-black italic lowercase tracking-tight">Conseiller FoodPilot</h3>
                 <p className="text-[10px] text-gray-400 uppercase font-bold">IA générative active</p>
              </div>
           </div>
           <Settings size={18} className="text-gray-300" />
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
           {chat.length === 0 && (
             <div className="text-center py-20">
                <Sparkles size={48} className="text-gray-100 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Posez-moi une question sur vos ventes ou vos stocks.</p>
             </div>
           )}
           {chat.map((c, i) => (
             <div key={i} className={cn("max-w-[80%] p-4 rounded-2xl", c.role === 'user' ? 'bg-primary text-white ml-auto rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none')}>
                <p className="text-sm leading-relaxed">{c.content}</p>
             </div>
           ))}
           {loading && <div className="bg-gray-50 p-4 rounded-2xl mr-auto animate-pulse w-32" />}
        </div>
        <div className="p-4 border-t flex gap-2">
           <input 
             value={prompt} 
             onChange={(e) => setPrompt(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
             placeholder="Suggère-moi un menu anti-gaspi pour demain..." 
             className="flex-1 bg-gray-50 px-6 py-3 rounded-2xl border-none focus:ring-2 focus:ring-primary/20"
           />
           <button onClick={handleSend} className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
              <ChevronRight />
           </button>
        </div>
      </div>
      <div className="space-y-6">
         <div className="bg-green-600 p-8 rounded-3xl text-white shadow-xl shadow-green-100">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4">Optimisation IA</h4>
            <p className="text-lg font-bold leading-tight">Le Yassa au Poulet est en sur-stock (45kg).</p>
            <p className="text-sm opacity-80 mt-2 italic">L'IA suggère d'activer une promo "Heure Creuse" à 13h45.</p>
            <button className="mt-6 w-full bg-white text-green-600 font-bold py-3 rounded-xl text-xs uppercase tracking-widest">Appliquer</button>
         </div>
      </div>
    </div>
  );
}

function AdminAntiGaspi() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black tracking-tight">Programme Anti-Gaspillage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm flex flex-col items-center text-center justify-center border-dashed border-2">
            <Leaf size={48} className="text-green-500 mb-4" />
            <h3 className="text-lg font-bold">Créer un Repas "Faut l'finir"</h3>
            <p className="text-gray-400 text-sm mb-6">Mettez en avant les invendus à prix cassé.</p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2">
               <Plus size={18} /> Lancer Offre
            </button>
         </div>
         <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-4">Statistiques Impact</h3>
            <div className="space-y-4">
               {[
                 { label: 'Plats sauvés', value: '142', color: 'bg-green-500' },
                 { label: 'CO2 économisé', value: '45kg', color: 'bg-blue-500' },
                 { label: 'Revenu récupéré', value: '250k F', color: 'bg-orange-500' },
               ].map(s => (
                 <div key={s.label}>
                    <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-tighter">
                       <span>{s.label}</span>
                       <span>{s.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className={cn("h-full", s.color)} style={{ width: '70%' }} />
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
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1 italic">Backoffice ESMT</p>
             <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none uppercase italic">Console FoodPilot</h2>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all font-mono">
                <FileText size={16} /> LOGS
             </button>
             <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-black/20 hover:scale-105 transition-transform">
                <ShieldCheck size={16} /> SYSTEM CHECK
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
             <Route path="reservations" element={<div className="p-20 text-center italic text-gray-400">Gestion des Réservations...</div>} />
             <Route path="orders" element={<div className="p-20 text-center italic text-gray-400">Flux des Commandes...</div>} />
             <Route path="kitchen" element={<div className="p-20 text-center italic text-gray-400">Pilotage Temps Réel Cuisine...</div>} />
             <Route path="tables" element={<div className="p-20 text-center italic text-gray-400">Plan de Salle Dynamique...</div>} />
             <Route path="fidelity" element={<div className="p-20 text-center italic text-gray-400">Programmes de Fidélité...</div>} />
             <Route path="feedback" element={<div className="p-20 text-center italic text-gray-400">Feedback & Support...</div>} />
             <Route path="profile" element={<div className="p-20 text-center italic text-gray-400">Paramètres du Profil...</div>} />
             <Route path="*" element={<Navigate to="stats" replace />} />
          </Routes>
       </div>
    </div>
  );
}
