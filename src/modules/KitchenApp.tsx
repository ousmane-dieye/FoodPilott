import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { 
  ChefHat, 
  Utensils, 
  ShoppingBag, 
  Package, 
  Sparkles, 
  Bell, 
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock3,
  Send,
  MessageSquare,
  QrCode,
  Scan,
  Loader2,
  XCircle,
  Ticket
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { MockOrderService, MockOrder } from "@/services/simulation";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export default function KitchenApp() {
  return (
    <Routes>
      <Route path="ops" element={<KitchenOpsView />} />
      <Route path="orders" element={<KitchenOpsView />} />
      <Route path="tickets" element={<PlaceholderView title="Tickets & Commandes" icon={<Ticket size={40} />} />} />
      <Route path="notifications" element={<PlaceholderView title="Alertes Live" icon={<Bell size={40} />} />} />
      <Route path="profile" element={<PlaceholderView title="Mon Profil Cuisine" icon={<User size={40} />} />} />
      <Route path="stock" element={<PlaceholderView title="Alertes Stocks" icon={<Package size={40} />} />} />
      <Route path="menu" element={<PlaceholderView title="Menu du Jour" icon={<Utensils size={40} />} />} />
      <Route path="*" element={<KitchenOpsView />} />
    </Routes>
  );
}

function PlaceholderView({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 bg-slate-900/5 dark:bg-slate-900/40 rounded-[48px] border-2 border-dashed border-slate-200 dark:border-slate-800">
      <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[32px] flex items-center justify-center text-primary shadow-large">
        {icon}
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black tracking-tightest text-slate-900 dark:text-white italic">{title}</h2>
        <p className="text-slate-500 font-medium">Station de production FoodPilot — Module en attente d'activation.</p>
      </div>
      <Link to="/kitchen/ops">
        <Button variant="secondary" className="px-8 h-14 rounded-2xl font-black italic bg-slate-900 text-white hover:bg-slate-800">RETOUR AUX OPS</Button>
      </Link>
    </div>
  );
}

function KitchenOpsView() {
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready' | 'served'>('pending');
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scannedOrder, setScannedOrder] = useState<MockOrder | null>(null);
  const [message, setMessage] = useState('');
  const [quickMessages] = useState([
    "Commande prête !",
    "Retard 10 min",
    "Rupture plat",
    "Plus de pain !"
  ]);

  React.useEffect(() => {
    return MockOrderService.subscribeToOrders((data) => {
      setOrders(data);
    });
  }, []);

  const handleStatusUpdate = (orderId: string, nextStatus: MockOrder['status']) => {
    MockOrderService.updateOrderStatus(orderId, nextStatus);
    toast.success(`Commande ${orderId} passée en statut : ${nextStatus}`);
  };

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      const readyOrder = orders.find(o => o.status === 'ready' && o.paymentStatus === 'paid');
      if (readyOrder) {
        setScannedOrder(readyOrder);
        toast.info("QR Code détecté ! Chargement des données...");
      } else {
        toast.error("Aucune commande prête trouvée pour le scan.");
        setScanning(false);
      }
    }, 1500);
  };

  const validateServed = () => {
    if (scannedOrder) {
      handleStatusUpdate(scannedOrder.id, 'served');
      setScannedOrder(null);
      setScanning(false);
      toast.success("Commande récupérée par l'étudiant !");
    }
  };

  const filteredOrders = orders.filter(o => o.status === activeTab);

  return (
    <div className="space-y-12">
       {/* High Contrast Stats section */}
       <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { t: 'Temp de prépa', v: '12 min', icon: Clock3, color: 'text-blue-600', bg: 'bg-blue-100' },
            { t: 'Commandes Live', v: '08', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-100' },
            { t: 'Taux Erreur', v: '1.2%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
            { t: 'Commandes/h', v: '42', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          ].map((s, i) => (
             <Card key={i} className="p-6 border-2 border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start mb-4">
                   <div className={cn("p-4 rounded-2xl shadow-sm", s.bg, s.color)}>
                      <s.icon size={24} />
                   </div>
                   <Badge variant="secondary" className="bg-slate-900 text-white border-none">+4%</Badge>
                </div>
                <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{s.v}</p>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">{s.t}</p>
             </Card>
          ))}
       </section>

       {/* Control Center */}
       <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-slate-900 text-white rounded-[20px] flex items-center justify-center shadow-xl animate-float">
                      <ChefHat size={28} />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black tracking-tightest text-slate-900 dark:text-white italic uppercase">Kitchen Ops</h2>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Station #01 • Production Live</p>
                   </div>
                </div>
                
                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl ring-2 ring-slate-200">
                   {(['pending', 'preparing', 'ready', 'served'] as const).map(tab => {
                      const isActive = activeTab === tab;
                      const activeClass = tab === 'pending' ? 'bg-orange-500 text-white' : tab === 'preparing' ? 'bg-blue-500 text-white' : tab === 'ready' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white';
                      return (
                       <button 
                         key={tab}
                         onClick={() => setActiveTab(tab)}
                         className={cn(
                           "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                           isActive 
                            ? `${activeClass} shadow-soft` 
                            : "text-slate-500 hover:text-slate-900"
                         )}
                       >
                         {tab === 'pending' ? 'Attente' : tab === 'preparing' ? 'Cuisine' : tab === 'ready' ? 'Prêtes' : 'Servies'}
                       </button>
                      );
                   })}
                </div>

                <Button 
                   onClick={simulateScan} 
                   className="h-14 bg-primary text-white font-black rounded-2xl px-8 hover:bg-primary-dark flex gap-3 items-center group shadow-soft border-none"
                >
                   <Scan className="group-hover:scale-110 transition-transform" />
                   SCANNER QR
                </Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                   {filteredOrders.map((order, idx) => (
                      <motion.div
                        layout
                        key={order.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                         <Card className="p-0 border-2 border-slate-200 shadow-soft overflow-hidden relative bg-white">
                            <div className="p-8">
                               <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                                  <div>
                                     <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-3xl font-black tracking-tightest text-slate-900 italic">{order.id}</h4>
                                        <Badge className={cn(
                                          "px-3 py-1 font-black uppercase text-[10px] tracking-widest border-none",
                                          order.paymentStatus === 'paid' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                                        )}>
                                          {order.paymentStatus === 'paid' ? 'PAYÉ' : 'À RÉGLER'}
                                        </Badge>
                                     </div>
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} className="text-primary"/> {order.createdAt} • {order.paymentMethod.toUpperCase()}
                                     </p>
                                  </div>
                                  <div className="text-right">
                                     <Badge variant="outline" className="font-mono text-xs font-black border-2 border-slate-200 bg-slate-50 text-slate-900 px-3 py-1 mb-2 block">
                                        {order.slot}
                                     </Badge>
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-tightest">PROCHE SORTIE</span>
                                  </div>
                               </div>

                               <div className="space-y-4 mb-10">
                                  {order.items.map((item: any, i: number) => (
                                     <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl ring-1 ring-slate-100 shadow-sm border-l-4 border-primary">
                                        <div className="flex flex-col">
                                          <span className="font-black text-lg text-slate-900 leading-tight">{item.quantity}x {item.name}</span>
                                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SANS PIMENT • EXTRA SAUCE</span>
                                        </div>
                                     </div>
                                  ))}
                               </div>

                               <div className="flex gap-3">
                                  {order.status === 'pending' && (
                                     <Button onClick={() => handleStatusUpdate(order.id, 'preparing')} className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 font-black text-white rounded-xl shadow-soft uppercase text-xs tracking-widest border-none">
                                        Lancer Cuisine
                                     </Button>
                                  )}
                                  {order.status === 'preparing' && (
                                     <Button onClick={() => handleStatusUpdate(order.id, 'ready')} className="flex-1 h-14 bg-blue-500 hover:bg-blue-600 font-black text-white rounded-xl shadow-soft uppercase text-xs tracking-widest border-none">
                                        Terminer
                                     </Button>
                                  )}
                                  {order.status === 'ready' && (
                                     <div className="flex-1 flex items-center justify-center bg-emerald-50 text-emerald-600 font-black rounded-xl text-xs uppercase italic border-2 border-emerald-200 h-14 tracking-widest">
                                        Prêt pour retrait
                                     </div>
                                  )}
                                  {order.status === 'served' && (
                                     <div className="flex-1 flex items-center justify-center bg-slate-100 text-slate-400 font-black rounded-xl text-xs uppercase border-2 border-slate-200 h-14 tracking-widest">
                                        Commande remise
                                     </div>
                                  )}
                                  <Button variant="ghost" size="icon" className="h-14 w-14 bg-slate-100 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600">
                                     <AlertCircle size={22} />
                                  </Button>
                               </div>
                            </div>
                         </Card>
                      </motion.div>
                   ))}
                </AnimatePresence>
             </div>
          </div>

          {/* High Contrast Messaging */}
          <div className="xl:col-span-1 space-y-6">
             <Card className="h-full flex flex-col p-8 sticky top-24 border-2 border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black tracking-tightest text-slate-900 dark:text-white italic uppercase flex items-center gap-2">
                      <MessageSquare size={22} className="text-primary"/> Staff Comms
                   </h3>
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-glow shadow-emerald-500/50" />
                </div>
                
                <div className="flex-1 space-y-5 mb-10 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                   <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border-l-4 border-primary">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest">Cuisine Admin</span>
                         <span className="text-[9px] text-white/50 font-black uppercase">12:44</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">Pic d'affluence prévu dans 15 min. Attention au stock Thieb.</p>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl ring-2 ring-slate-100 dark:ring-slate-700 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Serveur #2</span>
                         <span className="text-[9px] text-slate-400 font-black uppercase">12:45</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed italic">Table 4 demande du sel et de l'eau.</p>
                   </div>
                </div>

                <div className="space-y-5 mt-auto pt-8 border-t-2 border-slate-100 dark:border-slate-800">
                   <div className="flex flex-wrap gap-2 mb-2">
                      {quickMessages.map(qm => (
                         <button 
                           key={qm}
                           onClick={() => setMessage(qm)}
                           className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all border border-slate-200 dark:border-slate-700"
                         >
                            {qm}
                         </button>
                      ))}
                   </div>
                   <div className="flex gap-3">
                      <Input 
                        placeholder="Message rapide..." 
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="h-14 text-sm px-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl font-bold italic"
                      />
                      <Button size="icon" className="h-14 w-14 min-w-[56px] rounded-xl bg-slate-900 text-white shadow-lg">
                         <Send size={20} />
                      </Button>
                   </div>
                </div>
             </Card>
          </div>
       </div>

       {/* Scanner Simulation Modal - Enhanced */}
       <AnimatePresence>
          {(scanning || scannedOrder) && (
             <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl">
                <motion.div
                   initial={{ scale: 0.9, opacity: 0, y: 50 }}
                   animate={{ scale: 1, opacity: 1, y: 0 }}
                   exit={{ scale: 0.9, opacity: 0, y: 50 }}
                   transition={{ type: "spring", damping: 25, stiffness: 200 }}
                   className="bg-white dark:bg-slate-900 rounded-[56px] p-12 max-w-xl w-full relative shadow-3xl overflow-hidden border-2 border-white/20"
                >
                   {!scannedOrder ? (
                      <div className="text-center py-16">
                         <div className="w-32 h-32 bg-primary/20 rounded-[40px] flex items-center justify-center mx-auto mb-10 relative">
                            <div className="absolute inset-0 border-8 border-primary rounded-[40px] animate-ping opacity-20" />
                            <Loader2 className="text-primary animate-spin" size={64} />
                         </div>
                         <h3 className="text-5xl font-black tracking-tightest mb-4 italic uppercase text-slate-900 dark:text-white">SCAN EN COURS</h3>
                         <p className="text-slate-500 text-xl font-bold uppercase tracking-widest max-w-xs mx-auto">Veuillez présenter le QR Code de l'étudiant.</p>
                         <Button variant="ghost" onClick={() => setScanning(false)} className="mt-12 h-14 px-10 text-slate-400 hover:text-red-500 font-black text-xs uppercase tracking-widest">
                            Annuler l'opération
                         </Button>
                      </div>
                   ) : (
                      <div className="space-y-10">
                         <div className="flex justify-between items-start">
                            <div>
                               <div className="flex items-center gap-4">
                                  <Badge className="bg-emerald-500 text-white border-none py-2 px-6 font-black tracking-widest">ORDRE DÉFECTÉ</Badge>
                                  <span className="text-xs font-black uppercase text-slate-400 tracking-tightest">{new Date().toLocaleTimeString()}</span>
                               </div>
                               <h3 className="text-6xl font-black tracking-tightest mt-4 italic text-slate-900 dark:text-white uppercase">{scannedOrder.id}</h3>
                            </div>
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-[24px] flex items-center justify-center border-2 border-emerald-500/20">
                               <CheckCircle2 size={40} />
                            </div>
                         </div>

                         <div className="bg-slate-50 dark:bg-slate-800 rounded-[40px] p-10 ring-2 ring-slate-100 dark:ring-slate-700 shadow-inner">
                            <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">DÉTAILS COMMANDE HP-01</p>
                            <div className="space-y-4">
                               {scannedOrder.items.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between items-center text-2xl font-black text-slate-900 dark:text-white italic">
                                     <span>{item.quantity}x {item.name}</span>
                                     <span className="text-primary">{item.price * item.quantity} F</span>
                                  </div>
                               ))}
                               <div className="pt-8 mt-8 border-t-4 border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                  <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">TOTAL RÉGLÉ</span>
                                  <div className="flex flex-col items-end">
                                     <span className="text-4xl font-black text-primary italic">{scannedOrder.total} F</span>
                                     <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Transaction Success</span>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="flex gap-5">
                            <Button 
                              variant="secondary" 
                              className="h-20 flex-1 rounded-[28px] text-xl font-black italic uppercase tracking-widest bg-slate-100 text-slate-500"
                              onClick={() => { setScannedOrder(null); setScanning(false); }}
                            >
                               Rejeter
                            </Button>
                            <Button 
                              className="h-20 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[28px] text-xl font-black italic uppercase tracking-widest shadow-2xl relative overflow-hidden"
                              onClick={validateServed}
                            >
                               <span className="relative z-10">Confirmer Remise</span>
                               <motion.div initial={{ x: '-100%' }} animate={{ x: '200%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-white/20 skew-x-12" />
                            </Button>
                         </div>
                      </div>
                   )}
                </motion.div>
             </div>
          )}
       </AnimatePresence>

       {/* Enhanced Stock Alert Section */}
       <section>
          <Card className="p-10 border-none bg-slate-900 text-white shadow-3xl overflow-hidden relative rounded-[48px]">
             <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none rotate-12 scale-150">
                <Package size={140} />
             </div>
             <div className="relative flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-red-500/10 border-4 border-red-500/50 rounded-[28px] flex items-center justify-center text-red-500 animate-pulse shadow-glow shadow-red-500/50">
                      <AlertCircle size={40} />
                   </div>
                   <div className="max-w-md">
                      <h4 className="text-3xl font-black tracking-tightest mb-2 italic uppercase">Stocks Critiques</h4>
                      <p className="text-slate-400 text-lg font-medium leading-relaxed">Attention Chef ! Le stock de <span className="text-white font-black underline">"Pain Burger"</span> est à moins de 15%. Réapprovisionnement urgent requis.</p>
                   </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <Button variant="secondary" className="bg-white/10 text-white border-none hover:bg-white/20 px-10 h-16 rounded-2xl flex-1 md:flex-none font-bold uppercase text-xs tracking-widest">Ignorer</Button>
                   <Button className="bg-white text-slate-900 hover:bg-slate-200 px-10 h-16 rounded-2xl flex-1 md:flex-none font-black uppercase text-xs tracking-widest shadow-xl">Gérer Stocks</Button>
                </div>
             </div>
          </Card>
       </section>
    </div>
  );
}
