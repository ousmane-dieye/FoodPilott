import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  ShoppingBag, 
  Star, 
  ArrowRight, 
  Gift, 
  Zap,
  Clock,
  Heart
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function FidelityView() {
  return (
    <div className="max-w-5xl mx-auto space-y-16">
       <section className="bg-primary text-white rounded-[64px] p-16 text-center relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none rotate-12 scale-150">
             <Trophy size={200} />
          </div>
          <div className="absolute bottom-0 left-0 p-24 opacity-10 pointer-events-none -rotate-12 scale-150">
             <Sparkles size={200} />
          </div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative z-10"
          >
             <Badge className="bg-white/20 text-white border-2 border-white/40 px-8 py-3 mb-10 text-xs font-black uppercase tracking-widest rounded-full backdrop-blur-md italic shadow-xl">
                Membre Gold ESMT • Pilot Elite
             </Badge>
             <h2 className="text-8xl font-black tracking-tightest mb-6 italic italic uppercase">1,450 PTS</h2>
             <p className="text-white/80 text-xl font-bold mb-12 max-w-lg mx-auto leading-relaxed">
               Encore <span className="text-white underline decoration-4 decoration-white/40 underline-offset-8">550 points</span> pour débloquer votre <span className="font-black italic text-white uppercase tracking-wider">Burger Pilot Collector</span> !
             </p>
             <div className="w-full max-w-xl h-4 bg-white/10 rounded-full mx-auto relative overflow-hidden ring-4 ring-white/10 shadow-inner">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "70%" }}
                   transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                   className="absolute inset-y-0 left-0 bg-white shadow-glow shadow-white/50 rounded-full" 
                />
             </div>
             <div className="mt-6 flex justify-center gap-10 text-[10px] font-black uppercase tracking-widest opacity-60">
                <span>Niveau Argent</span>
                <span>Niveau Or</span>
                <span>Niveau Platine</span>
             </div>
          </motion.div>
       </section>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="p-12 border-none shadow-large bg-white dark:bg-slate-900 group">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black tracking-tightest italic uppercase flex items-center gap-4">
                   <Sparkles className="text-primary group-hover:rotate-12 transition-transform" /> Défis Hebdo
                </h3>
                <Badge className="bg-slate-900 text-white border-none py-1.5 px-3">+450 PTS TOTAL</Badge>
             </div>
             <div className="space-y-6">
                {[
                  { t: 'Healthy Week', d: 'Commandez 5 salades ou plats ESMT', p: '+150 pts', icon: Heart, iconColor: 'text-pink-500', bg: 'bg-pink-50' },
                  { t: 'Early Bird', d: 'Petit-déjeuner avant 8h30 3 fois', p: '+100 pts', icon: Clock, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
                  { t: 'Expert Pilot', d: 'Notez 3 plats cette semaine', p: '+200 pts', icon: Star, iconColor: 'text-amber-500', bg: 'bg-amber-50' },
                ].map((d, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 10 }}
                    className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl ring-2 ring-slate-100 dark:ring-slate-700 transition-all hover:scale-[1.02] shadow-sm"
                  >
                     <div className="flex items-center gap-6">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-soft", d.bg, d.iconColor)}>
                           <d.icon size={24} />
                        </div>
                        <div>
                           <p className="font-black text-lg text-ink italic leading-tight">{d.t}</p>
                           <p className="text-xs font-bold text-slate-400 mt-1">{d.d}</p>
                        </div>
                     </div>
                     <Badge className="bg-primary text-white font-black italic border-none shadow-lg">{d.p}</Badge>
                  </motion.div>
                ))}
             </div>
          </Card>
          
          <Card className="p-12 border-none shadow-large bg-white dark:bg-slate-900 group">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black tracking-tightest italic uppercase flex items-center gap-4">
                   <ShoppingBag className="text-primary group-hover:-translate-y-1 transition-transform" /> Boutique Cadeaux
                </h3>
                <Link to="/student/order">
                   <Button variant="ghost" className="text-primary font-black italic text-xs uppercase tracking-widest gap-2">RETOURNER AU MENU <ArrowRight size={14} /></Button>
                </Link>
             </div>
             <div className="space-y-6">
                {[
                  { t: 'Double Espresso', p: '300 pts', img: 'https://picsum.photos/seed/coffee/100/100', icon: Zap },
                  { t: 'Pain Choco ESMT', p: '400 pts', img: 'https://picsum.photos/seed/choco/100/100', icon: Gift },
                  { t: 'Pass Prioritaire', p: '600 pts', img: 'https://picsum.photos/seed/zap/100/100', icon: Zap },
                  { t: 'Menu Thieb Complet', p: '1200 pts', img: 'https://picsum.photos/seed/thieb/100/100', icon: Star },
                ].map((d, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl ring-2 ring-slate-100 dark:ring-slate-700 transition-all shadow-sm"
                  >
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-soft">
                           <img src={d.img} className="w-full h-full object-cover" alt={d.t} referrerPolicy="no-referrer" />
                        </div>
                        <div>
                           <p className="font-black text-lg text-ink italic leading-tight">{d.t}</p>
                           <p className="text-[10px] font-black text-primary uppercase tracking-tightest mt-1">{d.p} DISPONIBLE</p>
                        </div>
                     </div>
                     <Button className="h-12 px-6 rounded-xl font-black italic uppercase text-[10px] tracking-widest bg-ink text-white shadow-xl">Échanger</Button>
                  </motion.div>
                ))}
             </div>
          </Card>
       </div>

       {/* Special Event Section */}
       <Card className="p-16 border-none bg-emerald-600 dark:bg-emerald-900 text-white shadow-3xl rounded-[64px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-24 opacity-10 rotate-12 scale-150 pointer-events-none group-hover:rotate-45 transition-transform duration-1000">
             <Zap size={200} />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
             <div className="max-w-xl text-center md:text-left">
                <Badge className="bg-white/20 text-white border-2 border-white/40 mb-8 font-black uppercase tracking-widest px-6 py-2">Événement de la Semaine</Badge>
                <h3 className="text-6xl font-black tracking-tightest italic uppercase mb-6 leading-tight">Booste Tes Points x2</h3>
                <p className="text-emerald-100 text-xl font-medium leading-relaxed italic">
                   "Le Jeudi Teranga" : Tous vos points sont doublés sur les plats traditionnels (Thieb, Yassa, Mafé). Parrainez un ami pour gagner 500 pts bonus !
                </p>
             </div>
             <div className="flex flex-col gap-4 w-full md:w-auto">
                <Button className="bg-white text-emerald-600 hover:bg-slate-100 px-12 h-20 rounded-[28px] font-black italic text-xl shadow-2xl uppercase tracking-widest">Inviter un ami</Button>
                <p className="text-center md:text-right text-[10px] font-black uppercase tracking-widest opacity-60 italic">Offre valable jusqu'à Vendredi Minuit</p>
             </div>
          </div>
       </Card>
    </div>
  );
}
