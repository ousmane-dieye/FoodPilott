import { useState, useEffect } from "react";
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
  Coffee
} from "lucide-react";
import { cn } from "../lib/utils";
import { QRCodeSVG } from "qrcode.react";

// Types
type Screen = 'home' | 'menu' | 'order' | 'present' | 'tables' | 'points' | 'feedback' | 'profile';

export default function StudentApp() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [cart, setCart] = useState<any[]>([]);
  const [orderStep, setOrderStep] = useState(1);
  const [showQR, setShowQR] = useState(false);

  // Mock Data
  const menuItems = [
    { id: '1', name: 'Yassa au Poulet', price: 2500, allergens: ['None'], stock: 15, rating: 4.8, type: 'classic' },
    { id: '2', name: 'Thieboudienne Poisson', price: 3000, allergens: ['Poissons'], stock: 8, rating: 4.9, type: 'classic' },
    { id: '3', name: 'Salade de Quinoa Bio', price: 2000, allergens: ['None'], stock: 20, rating: 4.5, type: 'veg', green: true },
    { id: '4', name: 'Burger Végé', price: 2200, allergens: ['Gluten'], stock: 12, rating: 4.6, type: 'veg' },
  ];

  const userAllergens = ['Gluten'];

  const renderScreen = () => {
    switch(activeScreen) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                Occupation en direct
              </h2>
              <div className="flex items-end gap-2 h-32 mb-4">
                {[40, 60, 90, 85, 45, 30].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-500",
                        v > 80 ? "bg-red-500" : v > 50 ? "bg-orange-400" : "bg-primary"
                      )} 
                      style={{ height: `${v}%` }}
                    />
                    <span className="text-[10px] text-gray-400 font-medium">{11 + i}h</span>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                  <Leaf size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-900">Suggestion Créneau Calme</p>
                  <p className="text-xs text-green-700">Passez à 13h45 pour gagner <span className="font-bold">+50 pts</span> bonus !</p>
                </div>
              </div>
            </div>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Le menu du jour</h2>
                <button className="text-primary text-sm font-semibold">Voir tout</button>
              </div>
              <div className="grid gap-4">
                {menuItems.slice(0, 2).map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex gap-4 items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                      <Utensils size={32} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <span className="text-primary font-bold">{item.price} FCFA</span>
                      </div>
                      <div className="flex gap-2 mt-1">
                        {item.green && <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold flex items-center gap-1"><Leaf size={10}/> Anti-Gaspi</span>}
                        {item.allergens[0] !== 'None' && <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-bold">{item.allergens[0]}</span>}
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-yellow-500 font-bold">
                        <Star size={12} fill="currentColor" /> {item.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case 'menu':
        return (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['Tous', 'Végétarien', 'Sans Gluten', 'Express'].map((f) => (
                <button key={f} className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:border-primary hover:text-primary transition-colors">
                  {f}
                </button>
              ))}
            </div>
            
            <div className="grid gap-4">
              {menuItems.map((item) => {
                const isUserAllergic = item.allergens.some(a => userAllergens.includes(a));
                return (
                  <div key={item.id} className={cn(
                    "bg-white p-4 rounded-3xl border border-gray-100 transition-all",
                    isUserAllergic && "opacity-60 border-red-100 grayscale-[0.5]"
                  )}>
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 relative">
                        <Utensils size={32} />
                        {item.green && <div className="absolute -top-2 -right-2 bg-primary text-white p-1 rounded-full"><Leaf size={14} /></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900">{item.name}</h3>
                          <span className="text-primary font-bold">{item.price} F</span>
                        </div>
                        {isUserAllergic && (
                          <div className="flex items-center gap-1 text-red-600 font-bold text-[10px] mt-1">
                            <AlertCircle size={12} /> ATTENTION : Contient {item.allergens.join(', ')}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Plat équilibré avec légumes frais et épices locales.</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-400 font-medium">{item.stock} portions restantes</span>
                          <button 
                             onClick={() => {
                               if(!isUserAllergic) {
                                  setCart([...cart, item]);
                                  setActiveScreen('order');
                               }
                             }}
                             disabled={isUserAllergic}
                             className={cn(
                               "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                               isUserAllergic ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:shadow-lg shadow-primary/20"
                             )}
                          >
                            Commander
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'order':
        return (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl max-w-md mx-auto">
            <div className="flex justify-between mb-8">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                    orderStep >= s ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                  )}>{s}</div>
                  <span className="text-[10px] text-gray-400">Step {s}</span>
                </div>
              ))}
            </div>

            {orderStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Choisissez votre créneau</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['12:00', '12:15', '12:30', '12:45', '13:00', '13:15'].map(t => (
                    <button key={t} onClick={() => setOrderStep(2)} className="p-4 border rounded-2xl hover:border-primary hover:bg-green-50 text-sm font-bold transition-all">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {orderStep === 2 && (
              <div className="space-y-4 text-center py-4">
                <Utensils className="mx-auto text-primary" size={48} />
                <h3 className="text-xl font-bold">Récapitulatif</h3>
                <div className="bg-gray-50 p-4 rounded-2xl text-left">
                   {cart.map((item, i) => (
                     <div key={i} className="flex justify-between font-medium">
                       <span>{item.name}</span>
                       <span>{item.price} F</span>
                     </div>
                   ))}
                </div>
                <button onClick={() => setOrderStep(3)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                  Confirmer le plat
                </button>
              </div>
            )}

            {orderStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Paiement Mobile</h3>
                <div className="space-y-3">
                   <button onClick={() => setOrderStep(4)} className="w-full flex items-center justify-between p-4 border rounded-2xl hover:border-blue-500 bg-blue-50/20 group">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold italic">W</div>
                         <span className="font-bold">Wave</span>
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-blue-500" />
                   </button>
                   <button onClick={() => setOrderStep(4)} className="w-full flex items-center justify-between p-4 border rounded-2xl hover:border-orange-500 bg-orange-50/20 group">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold italic">O</div>
                         <span className="font-bold">Orange Money</span>
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-orange-500" />
                   </button>
                </div>
              </div>
            )}

            {orderStep === 4 && (
              <div className="space-y-6 text-center">
                 <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center text-primary mx-auto">
                    <QrCode size={32} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold">C'est prêt !</h3>
                    <p className="text-gray-500 text-sm mt-2">Présentez ce code à la borne ou au comptoir.</p>
                 </div>
                 <div className="bg-white p-4 border-2 border-dashed border-primary rounded-3xl inline-block mx-auto shadow-sm">
                   <QRCodeSVG value="FoodPilot-Order-XYZ-123" size={180} />
                 </div>
                 <div className="bg-red-50 text-red-600 p-2 rounded-lg text-xs font-bold animate-pulse">
                   Expire dans 14:55
                 </div>
                 <button onClick={() => setActiveScreen('home')} className="text-primary font-bold block mx-auto underline">
                    Retour à l'accueil
                 </button>
              </div>
            )}
          </div>
        );

      case 'tables':
        return (
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Plan de salle direct</h2>
                <div className="grid grid-cols-5 gap-3">
                   {Array.from({ length: 25 }).map((_, i) => {
                      const states = ['free', 'occupied', 'reserved'];
                      const state = states[Math.floor(Math.random() * 3)];
                      return (
                        <div key={i} className={cn(
                          "aspect-square rounded-xl border flex items-center justify-center text-xs font-bold transition-all",
                          state === 'free' ? "bg-green-50 border-green-200 text-primary" : 
                          state === 'occupied' ? "bg-red-50 border-red-200 text-red-500" : 
                          "bg-orange-50 border-orange-200 text-orange-500"
                        )}>
                          {i + 1}
                        </div>
                      )
                   })}
                </div>
                <div className="mt-6 flex gap-4 text-xs font-medium text-gray-500 justify-center">
                   <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full" /> Libre</div>
                   <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full" /> Occupée</div>
                   <div className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded-full" /> Réservée</div>
                </div>
             </div>
          </div>
        );

      case 'points':
        return (
           <div className="space-y-6">
              <div className="relative overflow-hidden bg-gradient-to-br from-primary to-green-700 p-8 rounded-3xl text-white shadow-xl shadow-primary/30">
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <p className="text-green-100 text-xs font-bold uppercase tracking-widest">Niveau Actuel</p>
                          <h3 className="text-3xl font-black">ARGENT</h3>
                       </div>
                       <Trophy size={48} className="text-yellow-400 rotate-12" />
                    </div>
                    <div className="space-y-2">
                       <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                       </div>
                       <p className="text-xs font-medium text-green-50 flex justify-between">
                          <span>1250 pts</span>
                          <span>Plus que 750 pts pour OR</span>
                       </p>
                    </div>
                 </div>
                 {/* Decor */}
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                 <div className="absolute top-0 left-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 text-center">
                    <Coffee className="text-brown-500" />
                    <p className="text-xs font-bold">Café offert</p>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">500 pts</span>
                 </div>
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 text-center">
                    <Utensils className="text-primary" />
                    <p className="text-xs font-bold">Accès Prioritaire</p>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">1500 pts</span>
                 </div>
              </div>
           </div>
        );

      default:
        return <div className="p-8 text-center text-gray-400 italic">Écran en cours de développement...</div>;
    }
  };

  return (
    <div className="max-w-md mx-auto relative min-h-[800px] bg-gray-50 flex flex-col">
       {/* Mobile Header Simulator */}
       <div className="bg-white pt-6 pb-2 px-6 flex justify-between items-center sticky top-0 z-50 border-b border-gray-50">
          <div>
             <p className="text-xs text-gray-400 font-bold uppercase">Bonjour,</p>
             <h1 className="text-lg font-black text-gray-900 leading-tight">Moussa Dieng</h1>
          </div>
          <div className="relative cursor-pointer" onClick={() => setActiveScreen('profile')}>
             <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                <img src="https://picsum.photos/seed/moussa/100/100" alt="Profile" referrerPolicy="no-referrer" />
             </div>
             <div className="absolute -top-1 -right-1 bg-primary w-4 h-4 rounded-full border-2 border-white text-[8px] flex items-center justify-center font-bold text-white">2</div>
          </div>
       </div>

       {/* Screen Content */}
       <div className="flex-1 p-6 pb-24 relative overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
       </div>

       {/* Custom Screen-based Action Float */}
       {activeScreen === 'home' && (
         <motion.button 
           whileTap={{ scale: 0.9 }}
           onClick={() => setActiveScreen('menu')}
           className="fixed bottom-24 right-8 bg-primary text-white p-4 rounded-full shadow-2xl shadow-primary/40 z-50 flex items-center gap-2"
         >
           <ShoppingBag size={24} />
           <span className="font-bold pr-2">Commander</span>
         </motion.button>
       )}

       {/* Tab Bar Simulator */}
       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 flex justify-around items-center z-50 sm:max-w-md sm:left-1/2 sm:-translate-x-1/2 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          {[
            { id: 'home', icon: Home, label: 'Accueil' },
            { id: 'menu', icon: Search, label: 'Menu' },
            { id: 'tables', icon: MapIcon, label: 'Tables' },
            { id: 'points', icon: Trophy, label: 'Points' },
            { id: 'profile', icon: UserIcon, label: 'Profil' },
          ].map((tab) => {
            const isActive = activeScreen === tab.id;
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveScreen(tab.id as Screen)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300",
                  isActive ? "text-primary scale-110" : "text-gray-400"
                )}
              >
                <Icon size={20} className={cn(isActive && "fill-current/10")} />
                <span className={cn("text-[9px] mt-1 font-bold transition-all", isActive ? "opacity-100" : "opacity-0")}>
                  {tab.label}
                </span>
              </button>
            )
          })}
       </div>
    </div>
  );
}
