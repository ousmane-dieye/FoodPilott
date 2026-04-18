import { useState, useEffect } from "react";
import { 
  QrCode, 
  CircleCheck, 
  Clock, 
  AlertCircle,
  Users,
  Utensils
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function Kiosk() {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const simulateScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('success');
      setTimeout(() => setScanState('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] bg-black rounded-[40px] border-[12px] border-gray-800 p-8 flex flex-col text-white shadow-2xl relative overflow-hidden">
       {/* UI Glow Background */}
       <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
       
       <header className="flex justify-between items-start mb-12">
          <div>
             <h1 className="text-5xl font-black text-primary tracking-tighter">FoodPilot</h1>
             <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Borne de Validation Inteligente</p>
          </div>
          <div className="text-right">
             <p className="text-4xl font-black tracking-tight">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
             <p className="text-sm font-medium text-gray-400 capitalize">{time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
       </header>

       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
             <div className="p-8 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-4xl flex items-center justify-between group overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                   <p className="text-gray-400 text-xs font-bold uppercase mb-2">Occupation actuelle</p>
                   <p className="text-5xl font-black text-primary">78%</p>
                </div>
                <Users size={64} className="text-gray-800 -rotate-12 group-hover:text-primary/20 transition-colors" />
             </div>

             <div className="p-8 bg-primary rounded-4xl text-white shadow-2xl shadow-primary/20">
                <div className="flex gap-4 items-center">
                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Clock size={32} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">Temps d'attente</h3>
                      <p className="text-4xl font-black leading-none">8 MIN</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="relative flex flex-col items-center">
             <AnimatePresence mode="wait">
                {scanState === 'idle' && (
                  <motion.div 
                    key="idle"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    className="flex flex-col items-center gap-6"
                  >
                     <div 
                        onClick={simulateScan}
                        className="w-64 h-64 bg-gray-900 border-4 border-dashed border-gray-700 rounded-5xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary transition-colors group"
                     >
                        <QrCode size={80} className="text-gray-600 group-hover:text-primary transition-all duration-500 group-hover:scale-110" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-primary transition-colors">Scanner pour valider</span>
                     </div>
                     <div className="bg-orange-500/10 border border-orange-500/20 px-6 py-3 rounded-2xl text-orange-400 text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={18} /> Rappel : Commande en ligne prioritaire
                     </div>
                  </motion.div>
                )}

                {scanState === 'scanning' && (
                  <motion.div 
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-8"
                  >
                     <div className="w-64 h-64 bg-gray-900 border-4 border-primary rounded-5xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_#00A86B] animate-scan" />
                        <QrCode size={80} className="text-primary opacity-50" />
                     </div>
                     <p className="text-2xl font-black animate-pulse uppercase tracking-widest tracking-tighter">ANALYSE EN COURS...</p>
                  </motion.div>
                )}

                {scanState === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-8"
                  >
                     <div className="w-64 h-64 bg-primary rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(0,168,107,0.4)]">
                        <CircleCheck size={120} className="text-white" />
                     </div>
                     <div className="text-center">
                        <p className="text-3xl font-black uppercase tracking-tight leading-none mb-1">DÉGUSTEZ BIEN !</p>
                        <p className="text-gray-400 text-lg font-bold">Votre plateau est validé</p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-primary font-black">
                           <Utensils size={20} /> TABLE #14 DISPONIBLE
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>

       <footer className="mt-auto flex justify-between items-center pt-8 border-t border-gray-800">
          <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Powered by FoodPilot Intelligence Unit</p>
          <div className="flex gap-4">
             <div className="w-8 h-8 bg-gray-800 rounded-lg" />
             <div className="w-8 h-8 bg-gray-800 rounded-lg" />
          </div>
       </footer>

       <style>{`
          @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
          }
          .animate-scan {
            animation: scan 2s linear infinite;
          }
       `}</style>
    </div>
  );
}
