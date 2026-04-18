import { useState } from "react";
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
  ArrowDownRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

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

  const stockItems = [
    { name: 'Riz Basmati', qty: '120kg', status: 'OK', color: 'bg-green-500' },
    { name: 'Poulet Fermier', qty: '15kg', status: 'CRITIQUE', color: 'bg-red-500' },
    { name: 'Oignons', qty: '45kg', status: 'FAIBLE', color: 'bg-yellow-500' },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
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

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black lowercase tracking-tighter italic">Flux hebdomadaire</h3>
                      <button className="text-primary text-xs font-bold flex items-center gap-1">
                        Détails <ChevronRight size={14} />
                      </button>
                   </div>
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
                            <Tooltip 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#00A86B" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black lowercase tracking-tighter italic">Alertes Stocks</h3>
                      <button className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2">
                         <Plus size={14} /> Réapprovisionner
                      </button>
                   </div>
                   <div className="space-y-4 flex-1">
                      {stockItems.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary/20 transition-all">
                           <div className="flex items-center gap-4">
                              <div className={cn("w-3 h-3 rounded-full", item.color)} />
                              <div>
                                 <p className="font-bold text-gray-900">{item.name}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.qty}</p>
                              </div>
                           </div>
                           <span className={cn(
                             "text-[9px] font-black px-2 py-1 rounded-lg",
                             item.status === 'OK' ? "bg-green-100 text-green-700" : 
                             item.status === 'CRITIQUE' ? "bg-red-100 text-red-700 animate-pulse" : 
                             "bg-yellow-100 text-yellow-700"
                           )}>
                              {item.status}
                           </span>
                        </div>
                      ))}
                   </div>
                   <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <ShieldCheck className="text-primary" />
                         <div>
                            <p className="text-xs font-bold text-primary">IA Commande Auto</p>
                            <p className="text-[10px] text-gray-500">Prévu pour demain 08h00</p>
                         </div>
                      </div>
                      <Settings size={16} className="text-gray-400 rotate-90" />
                   </div>
                </div>
             </div>
          </div>
        );
      case 'menu':
        return (
          <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm text-center py-24 italic text-gray-400 font-medium">
             Configuration du Menu (CRUD) en cours de déploiement...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Restauration Unifac</p>
             <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Console FoodPilot</h2>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                <FileText size={16} /> Export PDF
             </button>
             <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <TrendingUp size={16} /> Analytics Avancés
             </button>
          </div>
       </div>

       {/* Tabs */}
       <div className="flex gap-1 bg-gray-100 p-1.5 rounded-2xl w-fit">
          {[
            { id: 'overview', label: 'Vue Globale', icon: LayoutDashboard },
            { id: 'stocks', label: 'Stocks', icon: Package },
            { id: 'menu', label: 'Gestion Menu', icon: FileText },
            { id: 'settings', label: 'Paramètres', icon: Settings },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
       </div>

       <div className="min-h-[600px]">
          {renderContent()}
       </div>
    </div>
  );
}

// Just a helper to fix import in App.tsx
const LayoutDashboard = TrendingUp; // Placeholder because I'm defining a constant to avoid the import if I missed it
