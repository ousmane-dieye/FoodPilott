import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  QrCode, 
  Trophy, 
  Trash2,
  Clock,
  Plus,
  Minus,
  Leaf,
  Utensils,
  Coffee,
  Sparkles,
  Calendar,
  LayoutGrid,
  Bell,
  CheckCircle2,
  X,
  Star,
  ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from 'sonner';

// Services & Hooks
import { useMenu } from "../hooks/useMenu";
import { useUserOrders } from "../hooks/useOrders";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { OrderService } from "../services/orders";
import { MenuItem } from "../types";
import { MOCK_LOYALTY } from "../mocks/users";
import { MOCK_TABLES, MOCK_RESERVATIONS, MOCK_WASTE_MEALS } from "../mocks/simulation";

// --- SUB-COMPONENTS ---

function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isPlacing, setIsPlacing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour commander");
      return;
    }
    if (items.length === 0) return;

    setIsPlacing(true);
    try {
      await OrderService.placeOrder({
        userId: user.uid,
        items,
        total,
        status: 'pending',
        slot: '12:30'
      });
      toast.success("Commande envoyée en cuisine !");
      clearCart();
      onClose();
      navigate('/student/history');
    } catch (error) {
      toast.error("Échec de la commande");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-end"
      onClick={onClose}
    >
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
             <ShoppingBag className="text-primary" />
             <h2 className="text-2xl font-black italic tracking-tight uppercase">Mon Panier</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-4">
               <ShoppingBag size={64} className="text-gray-100" />
               <p className="text-gray-400 font-medium">Votre panier est vide pour le moment.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 rounded-3xl flex gap-4 items-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-400">
                  <Utensils size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-primary font-black text-xs">{item.price} F</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-8 border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center text-lg font-black italic uppercase">
              <span>Total</span>
              <span className="text-primary text-2xl">{total} FCFA</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isPlacing}
              className="w-full bg-primary text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isPlacing ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={24} />
                  Valider & Payer
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function StudentOrder() {
  const { items: menuItems, loading } = useMenu();
  const { addItem } = useCartStore();

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-4 h-32 rounded-3xl animate-pulse flex gap-4">
            <div className="w-24 bg-gray-100 rounded-2xl" />
            <div className="flex-1 space-y-2 py-4">
               <div className="h-4 bg-gray-100 rounded w-1/2" />
               <div className="h-4 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

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
                <Star size={12} fill="currentColor" /> {item.rating || 4.5}
              </div>
              <div className="mt-4 flex justify-between items-center">
                 <span className={cn(
                   "text-[10px] font-black uppercase tracking-widest",
                   item.stock > 5 ? "text-gray-400" : "text-red-500"
                 )}>
                   {item.stock} dispo
                 </span>
                 <button 
                  onClick={() => {
                    addItem(item);
                    toast.success(`${item.name} ajouté au panier`);
                  }}
                  className="bg-gray-100 text-gray-900 w-10 h-10 rounded-2xl flex items-center justify-center font-bold hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                 >
                    <Plus size={20} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentHistory() {
  const { orders, loading } = useUserOrders();

  if (loading) return <div className="p-8 text-center text-gray-400 font-bold animate-pulse uppercase text-xs">Chargement historique...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <h3 className="text-xl font-black italic tracking-tight uppercase">Mes Commandes</h3>
       <div className="grid gap-4">
          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-[40px] text-center space-y-4">
               <QrCode size={48} className="text-gray-100 mx-auto" />
               <p className="text-gray-400 font-medium italic">Aucune commande passée.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-4">
                 <div className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-2xl">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">#{order.id.slice(-6).toUpperCase()}</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                      order.status === 'completed' ? "bg-green-100 text-green-600" :
                      order.status === 'preparing' ? "bg-orange-100 text-orange-600 animate-pulse" :
                      "bg-blue-100 text-blue-600"
                    )}>{order.status}</span>
                 </div>
                 <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm font-bold">
                         <span className="text-gray-900">{item.name} <span className="text-gray-400 font-medium">x{item.quantity}</span></span>
                      </div>
                    ))}
                 </div>
                 <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-lg font-black tracking-tight">
                    <span className="italic uppercase text-gray-400 text-xs">Total</span>
                    <span className="text-primary">{order.total} F</span>
                 </div>
              </div>
            ))
          )}
       </div>
    </div>
  );
}

function StudentFidelity() {
  const { isDemoMode } = useAuthStore();
  const loyalty = isDemoMode ? MOCK_LOYALTY : { points: 0, tier: 'Bronze', nextReward: '...', pointsToNext: 500 };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <p className="text-green-200 text-xs font-black uppercase tracking-[0.2em]">Votre Statut</p>
                   <h3 className="text-4xl font-black italic">{loyalty.tier.toUpperCase()}</h3>
                </div>
                <Trophy size={48} className="text-yellow-400" />
             </div>
             <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/10 p-0.5">
                   <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                </div>
                <p className="text-xs font-bold text-green-100 flex justify-between uppercase">
                   <span>{loyalty.points} PTS</span>
                   <span>Niveau suivant : {loyalty.nextReward}</span>
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
            { label: 'Repas Gratuit', pts: 2500, icon: ShoppingBag },
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
             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Optimisé pour FoodPilot</p>
          </div>
       </div>
       <div className="flex-1 bg-gray-50/50 rounded-[40px] p-6 text-center flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-100">
          <Sparkles size={48} className="text-gray-200" />
          <p className="text-gray-400 font-medium italic px-8">Posez une question sur l'équilibre de votre repas ou obtenez des conseils personnalisés.</p>
          <div className="grid gap-2 w-full mt-8">
             {["Est-ce que le Yassa est équilibré ?", "Mon menu sans gluten du jour ?", "Calories du Thieb ?"].map(q => (
               <button key={q} className="bg-white border border-gray-100 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-primary hover:text-primary transition-all shadow-sm">{q}</button>
             ))}
          </div>
       </div>
       <div className="p-4 bg-white border border-gray-100 rounded-[32px] shadow-lg flex gap-2">
          <input className="flex-1 bg-transparent px-4 py-2 border-none outline-none text-sm font-medium" placeholder="Demander à l'assistant..." />
          <button className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"><ChevronRight/></button>
       </div>
    </div>
  );
}

function StudentTables() {
  const { isDemoMode } = useAuthStore();
  const tables = isDemoMode ? MOCK_TABLES : Array.from({ length: 25 }, (_, i) => ({ id: i, status: 'libre' }));

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
             {tables.map((t: any, i) => (
                <div key={i} className={cn(
                  "aspect-square rounded-2xl border flex items-center justify-center text-[10px] font-black transition-all",
                  t.status === 'libre' ? "bg-green-50 border-green-200 text-primary" : 
                  t.status === 'occupée' ? "bg-red-50 border-red-100 text-red-500" :
                  "bg-orange-50 border-orange-100 text-orange-500"
                )}>
                   {i + 1}
                </div>
             ))}
          </div>
       </div>
       <div className="bg-black p-8 rounded-[32px] text-white flex justify-between items-center">
          <div>
             <h4 className="font-bold uppercase italic text-sm">Affluence : Moyenne</h4>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Estimé : 5 min d'attente</p>
          </div>
          <Clock size={32} className="text-primary" />
       </div>
    </div>
  );
}

function StudentReservations() {
  const { isDemoMode } = useAuthStore();
  const resas = isDemoMode ? MOCK_RESERVATIONS : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
          <h3 className="text-xl font-black italic tracking-tight uppercase">Mes Réservations</h3>
          <button className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">+ Réserver</button>
       </div>
       <div className="grid gap-4">
          {resas.length === 0 ? (
            <div className="bg-white p-12 rounded-[40px] text-center space-y-4">
               <Calendar size={48} className="text-gray-100 mx-auto" />
               <p className="text-gray-400 font-medium italic">Aucune réservation active.</p>
            </div>
          ) : (
            resas.map(r => (
              <div key={r.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                       <LayoutGrid size={24} />
                    </div>
                    <div>
                       <p className="font-bold">Table #{r.tableId.slice(1)}</p>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aujourd'hui, {r.time}</p>
                    </div>
                 </div>
                 <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{r.status}</span>
              </div>
            ))
          )}
       </div>
    </div>
  );
}

function StudentAntiGaspi() {
  const { isDemoMode } = useAuthStore();
  const meals = isDemoMode ? MOCK_WASTE_MEALS : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="bg-green-600 p-8 rounded-[48px] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
             <h3 className="text-2xl font-black italic uppercase leading-none mb-2">Sauvez un repas</h3>
             <p className="text-green-100 text-sm opacity-80">Prix cassés sur les surplus du jour. Agissez vite !</p>
          </div>
          <Leaf size={64} className="absolute -right-4 -top-4 opacity-20 rotate-12" />
       </div>

       <div className="grid gap-4">
          {meals.length === 0 ? (
            <div className="bg-white p-12 rounded-[40px] text-center space-y-4">
               <Trash2 size={48} className="text-gray-100 mx-auto" />
               <p className="text-gray-400 font-medium italic">Revenez plus tard pour les bons plans.</p>
            </div>
          ) : (
            meals.map(m => (
              <div key={m.id} className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm flex gap-4 items-center group overflow-hidden">
                 <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img referrerPolicy="no-referrer" src={m.imageUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{m.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-primary font-black">{m.price} F</span>
                       <span className="text-[10px] text-gray-400 line-through font-bold">{m.originalPrice} F</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Encore {m.available} dispo</p>
                 </div>
                 <button className="bg-green-100 text-green-700 p-3 rounded-2xl hover:bg-green-600 hover:text-white transition-all"><Plus size={20}/></button>
              </div>
            ))
          )}
       </div>
    </div>
  );
}

// --- MAIN MODULE ---

export default function StudentApp() {
  const { user, profile } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 relative">
       <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex justify-between items-center sticky top-4 z-30 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-xl ring-1 ring-gray-100">
                <img src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} alt="Avatar" referrerPolicy="no-referrer" />
             </div>
             <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">{profile?.role || 'STUDENT'}</p>
                <h2 className="font-black italic text-lg leading-none">{profile?.displayName || user?.displayName}</h2>
             </div>
          </div>
          <div className="flex items-center gap-2">
              <div 
                onClick={() => setShowCart(true)}
                className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 relative cursor-pointer hover:bg-white hover:shadow-sm transition-all"
              >
                 <ShoppingBag size={20} />
                 {cartItems.length > 0 && (
                   <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                     {cartItems.length}
                   </span>
                 )}
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                 <Bell size={20} />
              </div>
          </div>
       </div>

       <div className="min-h-[600px]">
          <Routes>
             <Route path="order" element={<StudentOrder />} />
             <Route path="history" element={<StudentHistory />} />
             <Route path="fidelity" element={<StudentFidelity />} />
             <Route path="ai" element={<StudentAI />} />
             <Route path="tables" element={<StudentTables />} />
             <Route path="reservations" element={<StudentReservations />} />
             <Route path="antigaspi" element={<StudentAntiGaspi />} />
             <Route path="feedback" element={<div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest italic text-xs">Envoyer un avis...</div>} />
             <Route path="profile" element={<div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest italic text-xs">Mes paramètres profil...</div>} />
             <Route path="*" element={<Navigate to="order" replace />} />
          </Routes>
       </div>

       <AnimatePresence>
         {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
       </AnimatePresence>
    </div>
  );
}
