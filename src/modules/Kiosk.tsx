import React, { useState } from "react";
import { 
  Utensils, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Plus, 
  Minus,
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

// UI Components
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const menu = [
  { id: 1, name: "Menu Thieboudienne", price: 2500, img: "https://picsum.photos/seed/th/400/400" },
  { id: 2, name: "Menu Burger Pilot", price: 3500, img: "https://picsum.photos/seed/bg/400/400" },
  { id: 3, name: "Menu Yassa Poulet", price: 2800, img: "https://picsum.photos/seed/ys/400/400" },
  { id: 4, name: "Menu Salade César", price: 2200, img: "https://picsum.photos/seed/sl/400/400" },
];

export default function Kiosk() {
  const [view, setView] = useState<'welcome' | 'order' | 'checkout' | 'success'>('welcome');
  const [cart, setCart] = useState<Record<number, number>>({});

  const cartValues = Object.values(cart) as number[];
  const cartCount = cartValues.reduce((a, b) => a + b, 0);
  
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.find(it => it.id === Number(id));
    return sum + ((item?.price || 0) * (qty as number));
  }, 0);

  const updateCart = (id: number, delta: number) => {
    setCart(prev => {
      const news = { ...prev };
      const currentQty = (news[id] as number) || 0;
      news[id] = currentQty + delta;
      if (news[id] <= 0) delete news[id];
      return news;
    });
  };

  const handleCheckout = () => {
    setView('checkout');
    setTimeout(() => setView('success'), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-background text-ink flex flex-col font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'welcome' && (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-12 text-center"
            onClick={() => setView('order')}
          >
             <div className="w-40 h-40 bg-primary text-white rounded-[56px] flex items-center justify-center shadow-large mb-12 animate-bounce">
                <Utensils size={80} />
             </div>
             <h1 className="text-8xl font-black tracking-tightest mb-4 italic">FoodPilot Kiosk</h1>
             <p className="text-2xl text-gray-400 font-bold mb-16 uppercase tracking-widest">Touchez pour démarrer votre commande</p>
             <div className="flex gap-4">
                <Badge variant="primary" className="px-6 py-2 text-lg">Commande Express</Badge>
                <Badge variant="secondary" className="px-6 py-2 text-lg">Paiement Flow</Badge>
             </div>
          </motion.div>
        )}

        {view === 'order' && (
          <motion.div 
            key="order"
            initial={{ x: 1000 }}
            animate={{ x: 0 }}
            exit={{ x: -1000 }}
            className="flex-1 flex flex-col h-full"
          >
            <header className="p-12 pb-6 flex justify-between items-center bg-surface border-b border-gray-50">
               <div className="flex items-center gap-6">
                  <Button variant="ghost" size="icon" onClick={() => setView('welcome')} className="w-16 h-16 rounded-3xl">
                     <ChevronLeft size={40} />
                  </Button>
                  <h2 className="text-5xl font-black tracking-tightest italic">Choisissez votre Menu</h2>
               </div>
               <div className="flex items-center gap-4">
                  <div className="text-right">
                     <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Heure Locale</p>
                     <p className="text-2xl font-black font-mono">12:30</p>
                  </div>
                  <Clock className="text-primary" size={32} />
               </div>
            </header>

            <div className="flex-1 p-12 grid grid-cols-2 gap-12 overflow-y-auto custom-scrollbar">
               {menu.map((item) => (
                 <Card key={item.id} className="p-0 overflow-hidden border-none shadow-medium group relative active:scale-95 transition-transform">
                    <div className="h-80 overflow-hidden">
                       <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="p-10 flex justify-between items-center bg-surface">
                       <div>
                          <h3 className="text-3xl font-black text-ink tracking-tighter mb-2">{item.name}</h3>
                          <p className="text-2xl font-black text-primary">{item.price} F</p>
                       </div>
                       <div className="flex items-center gap-6">
                          {((cart[item.id] as number) || 0) > 0 ? (
                             <div className="flex items-center gap-8 bg-background rounded-3xl p-2 ring-2 ring-primary/20">
                                <button onClick={() => updateCart(item.id, -1)} className="w-16 h-16 flex items-center justify-center rounded-2xl bg-surface shadow-soft text-ink hover:bg-gray-100 transition-colors"><Minus size={32}/></button>
                                <span className="text-4xl font-black text-ink">{cart[item.id]}</span>
                                <button onClick={() => updateCart(item.id, 1)} className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary text-white shadow-soft hover:bg-primary-dark transition-colors"><Plus size={32}/></button>
                             </div>
                          ) : (
                             <Button onClick={() => updateCart(item.id, 1)} className="w-24 h-24 rounded-full bg-ink text-white font-black text-4xl leading-none">
                                <Plus size={40} />
                             </Button>
                          )}
                       </div>
                    </div>
                 </Card>
               ))}
            </div>

            {cartCount > 0 && (
               <motion.div 
                 initial={{ y: 200 }}
                 animate={{ y: 0 }}
                 className="p-12 pb-20 bg-surface border-t border-gray-100"
               >
                  <div className="max-w-4xl mx-auto flex items-center justify-between">
                     <div className="flex items-center gap-8">
                        <div className="w-24 h-24 rounded-[32px] bg-primary/10 text-primary flex items-center justify-center font-black text-4xl">
                           {cartCount}
                        </div>
                        <div>
                           <p className="text-xl font-bold text-gray-400 uppercase tracking-widest">Total Panier</p>
                           <h4 className="text-6xl font-black tracking-tightest">{total} F</h4>
                        </div>
                     </div>
                     <Button onClick={handleCheckout} className="h-28 px-16 rounded-[40px] text-4xl font-black shadow-large group">
                        Payer <ArrowRight className="ml-4 group-hover:translate-x-4 transition-transform" size={40} />
                     </Button>
                  </div>
               </motion.div>
            )}
          </motion.div>
        )}

        {view === 'checkout' && (
           <motion.div 
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-primary text-white"
           >
              <div className="w-48 h-48 border-8 border-white/20 border-t-white rounded-full animate-spin mb-12 shadow-large" />
              <h2 className="text-7xl font-black tracking-tightest mb-4 italic">Traitement du Paiement</h2>
              <p className="text-2xl font-bold opacity-60 uppercase tracking-widest italic animate-pulse">Veuillez patienter...</p>
           </motion.div>
        )}

        {view === 'success' && (
           <motion.div 
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-background"
           >
              <div className="w-64 h-64 bg-emerald-500 text-white rounded-[64px] flex items-center justify-center shadow-large mb-12">
                 <CheckCircle2 size={120} />
              </div>
              <h2 className="text-8xl font-black tracking-tightest mb-4 italic text-ink text-primary">Merci !</h2>
              <p className="text-3xl font-black text-ink tracking-tighter mb-16">Votre commande #A-42 est en cours de préparation.</p>
              <Button onClick={() => { setCart({}); setView('welcome'); }} className="h-24 px-16 rounded-[32px] text-3xl font-black">
                 Terminer
              </Button>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
