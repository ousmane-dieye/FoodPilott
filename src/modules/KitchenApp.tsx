import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChefHat, 
  TrendingUp, 
  MessageCircle, 
  Package,
  Zap
} from "lucide-react";
import { cn } from "../lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function KitchenApp() {
  const [orders, setOrders] = useState([
    { id: '1', name: 'Yassa au Poulet', slot: '12:15', status: 'preparing', priority: true, options: 'Sans gluten' },
    { id: '2', name: 'Thieboudienne Poisson', slot: '12:15', status: 'pending', priority: false },
    { id: '3', name: 'Burger Végé', slot: '12:30', status: 'pending', priority: false },
  ]);

  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    fetch('/api/predict-demand?day=Monday&hour=12')
      .then(res => res.json())
      .then(data => setPrediction(data));
  }, []);

  const chartData = [
    { time: '11:00', real: 40, predicted: 45 },
    { time: '11:30', real: 85, predicted: 90 },
    { time: '12:00', real: 210, predicted: 230 },
    { time: '12:30', real: 340, predicted: 360 },
    { time: '13:00', real: 180, predicted: 200 },
  ];

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Sidebar: Prediction & Coms */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-2 text-primary font-bold mb-4">
              <Zap size={20} fill="currentColor" />
              <span>Prévision IA (Demand Forecast)</span>
           </div>
           {prediction ? (
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Nombre attendu</p>
                      <p className="text-2xl font-black">{prediction.prediction}</p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Confiance</p>
                      <p className="text-2xl font-black">{Math.round(prediction.confidence * 100)}%</p>
                   </div>
                </div>
                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                   <p className="text-xs text-primary font-bold">Conseil Chef IA :</p>
                   <p className="text-sm text-green-900 mt-1 italic">Lancez les cuissons du riz à {prediction.suggestedPrepStartTime} pour éviter les bouchons de 12h30.</p>
                </div>
                <div className="h-48 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                         <XAxis dataKey="time" fontSize={10} />
                         <YAxis fontSize={10} />
                         <Tooltip />
                         <Line type="monotone" dataKey="predicted" stroke="#00A86B" strokeWidth={2} dot={false} />
                         <Line type="monotone" dataKey="real" stroke="#ccc" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
             </div>
           ) : <div className="animate-pulse h-40 bg-gray-100 rounded-2xl" />}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="font-bold flex items-center gap-2 mb-4">
              <MessageCircle size={18} className="text-blue-500" />
              Communication Rapide
           </h3>
           <div className="grid grid-cols-2 gap-2">
              {['Prêt au service', 'Rupture Plat A', 'Retard 5 min', 'Besoin Aide'].map(m => (
                <button key={m} className="p-3 text-xs font-bold border rounded-xl hover:bg-gray-50 transition-all text-gray-700">
                   {m}
                </button>
              ))}
           </div>
        </div>

        <div className="bg-orange-500 p-6 rounded-3xl text-white shadow-xl shadow-orange-200">
           <div className="flex items-center gap-2 mb-4 font-bold uppercase tracking-widest text-xs">
              <TrendingUp size={16} />
              Alerte Surplus
           </div>
           <p className="text-2xl font-black mb-2">24 portions restantes</p>
           <p className="text-sm text-orange-100 font-medium leading-relaxed">Le stock de riz est anormalement élevé. Voulez-vous activer le repas <b>"Anti-Gaspi"</b> (-40%) sur l'application ?</p>
           <button className="mt-4 w-full bg-white text-orange-500 font-bold py-3 rounded-xl shadow-lg border-2 border-transparent active:border-white transition-all">
              ACTIVER OFFRE SPÉCIALE
           </button>
        </div>
      </div>

      {/* Main Column: Active Orders */}
      <div className="lg:col-span-2 space-y-6">
         <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-20 z-10">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
               <ChefHat size={28} className="text-primary" />
               Tableau de Bord Préparation
            </h2>
            <div className="flex gap-4">
               <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">En attente</p>
                  <p className="text-xl font-black text-orange-500">{orders.filter(o => o.status === 'pending').length}</p>
               </div>
               <div className="text-right border-l pl-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">En cours</p>
                  <p className="text-xl font-black text-blue-500">{orders.filter(o => o.status === 'preparing').length}</p>
               </div>
            </div>
         </div>

         <div className="grid gap-4">
            <AnimatePresence>
               {orders.map((order) => (
                  <motion.div 
                    layout
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "bg-white p-6 rounded-3xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all",
                      order.status === 'preparing' ? "border-blue-500 shadow-lg shadow-blue-50" : "border-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-4">
                       <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg",
                          order.status === 'preparing' ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"
                       )}>
                          {order.id.padStart(2, '0')}
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                             <h4 className="text-lg font-bold">{order.name}</h4>
                             {order.priority && (
                                <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">PRIORITAIRE</span>
                             )}
                          </div>
                          <div className="flex gap-4 mt-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                             <span className="flex items-center gap-1"><Clock size={12} /> {order.slot}</span>
                             {order.options && <span className="text-orange-500 flex items-center gap-1"><AlertTriangle size={12} /> {order.options}</span>}
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                       {order.status === 'pending' ? (
                          <button 
                            onClick={() => updateStatus(order.id, 'preparing')}
                            className="bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all flex items-center gap-2"
                          >
                             <Zap size={18} fill="currentColor" />
                             COMMENCER
                          </button>
                       ) : (
                          <button 
                            onClick={() => updateStatus(order.id, 'ready')}
                            className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-green-600 transition-all flex items-center gap-2"
                          >
                             <CheckCircle2 size={18} />
                             C'EST PRÊT
                          </button>
                       )}
                       <button className="p-3 bg-gray-100 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                          <AlertTriangle size={20} />
                       </button>
                    </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
