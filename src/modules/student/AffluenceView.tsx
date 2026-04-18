import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Clock, 
  LayoutGrid, 
  TrendingUp, 
  ArrowRight, 
  Timer,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { MockOrderService } from '@/services/simulation';

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const affluenceData = [
  { time: '11:00', value: 15 },
  { time: '12:00', value: 85 },
  { time: '12:30', value: 95 },
  { time: '13:00', value: 65 },
  { time: '13:30', value: 40 },
  { time: '14:00', value: 20 },
  { time: '15:00', value: 10 },
];

export default function AffluenceView() {
  const [activeOrders, setActiveOrders] = React.useState(0);
  const [occupiedTables, setOccupiedTables] = React.useState(12); // Simulated static
  
  React.useEffect(() => {
    return MockOrderService.subscribeToOrders((orders) => {
      const active = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
      setActiveOrders(active);
    });
  }, []);

  // Calculate global affluence state
  // High if orders > 5 OR tables > 20
  // Medium if orders > 2 OR tables > 10
  // Low otherwise
  const getAffluenceState = () => {
    if (activeOrders > 8 || occupiedTables > 25) return { label: 'Plein', color: 'bg-red-500', text: 'affluence_critical', desc: 'Restaurant très fréquenté - temps d’attente élevé' };
    if (activeOrders > 3 || occupiedTables > 12) return { label: 'Moyen', color: 'bg-amber-500', text: 'affluence_medium', desc: 'Fréquentation modérée - service fluide' };
    return { label: 'Vide', color: 'bg-emerald-500', text: 'affluence_low', desc: 'Restaurant peu fréquenté - service ultra rapide' };
  };

  const state = getAffluenceState();

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-5xl font-black tracking-tightest text-ink italic mb-2 uppercase">Affluence Live</h2>
        <p className="text-ink-secondary font-black uppercase tracking-widest text-base">Temps réel & Prévisions • Restaurant ESMT</p>
      </header>

      {/* Main Indicator */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-12 flex flex-col items-center justify-center text-center overflow-hidden relative group">
          <div className={cn(
            "absolute inset-0 opacity-5 transition-opacity duration-1000",
            state.color
          )} />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10"
          >
            <div className={cn(
              "w-48 h-48 rounded-[64px] flex items-center justify-center mb-8 shadow-large animate-float",
              state.color,
              "ring-8 ring-white/20 dark:ring-black/20"
            )}>
              <Users size={80} className="text-white" />
            </div>
            
            <h3 className="text-6xl font-black tracking-tightest text-ink mb-2 uppercase">{state.label}</h3>
            <p className={cn("text-xl font-black uppercase tracking-widest mb-6", state.color.replace('bg-', 'text-'))}>
              {state.desc}
            </p>
            
            <Badge variant="secondary" className="px-8 py-3 rounded-2xl bg-surface text-ink font-bold text-lg shadow-soft border-2 border-gray-100">
               ~{state.label === 'Vide' ? '5' : state.label === 'Moyen' ? '15' : '30'}+ min d'attente
            </Badge>
          </motion.div>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card className="p-8 flex flex-col justify-between hoverable border-2 border-gray-100 bg-white">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-medium">
              <Timer size={28} />
            </div>
            <div>
              <p className="text-5xl font-black text-ink mb-1">{activeOrders}</p>
              <p className="text-[11px] font-black text-ink-secondary uppercase tracking-widest leading-relaxed">Commandes en préparation</p>
            </div>
          </Card>
          
          <Card className="p-8 flex flex-col justify-between hoverable border-2 border-gray-100 bg-white">
            <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-medium">
              <LayoutGrid size={28} />
            </div>
            <div>
              <p className="text-5xl font-black text-ink mb-1">{occupiedTables}/40</p>
              <p className="text-[11px] font-black text-ink-secondary uppercase tracking-widest leading-relaxed">Tables occupées en salle</p>
            </div>
          </Card>

          <Card className="col-span-2 p-8 bg-ink text-white shadow-large relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
              <TrendingUp size={120} />
            </div>
            <div className="relative">
              <Badge className="bg-white/20 text-white mb-4 border-none px-4 py-1.5 font-bold">INFO ESMT</Badge>
              <h4 className="text-2xl font-black tracking-tight mb-2 italic">Prochain pic prévu à 12:30</h4>
              <p className="text-gray-400 font-medium">Réservez dès maintenant pour éviter la file d'attente de la pause méridienne.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Historical Chart */}
      <section className="space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-ink uppercase italic mb-1">Évolution de la Journée</h3>
            <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest">Moyenne basée sur les 30 derniers jours</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 pr-4 border-r border-gray-100">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-[10px] font-black uppercase text-ink-secondary">Plein</span>
            </div>
            <div className="flex items-center gap-1.5 pl-4 px-4 border-r border-gray-100">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span className="text-[10px] font-black uppercase text-ink-secondary">Moyen</span>
            </div>
            <div className="flex items-center gap-1.5 pl-4">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black uppercase text-ink-secondary">Libre</span>
            </div>
          </div>
        </header>

        <Card className="p-8 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={affluenceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 900, fill: '#64748B' }} 
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-large)', fontWeight: 900, fontSize: '12px' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[12, 12, 0, 0]} 
                  barSize={40}
                >
                  {affluenceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value > 80 ? '#EF4444' : entry.value > 40 ? '#F59E0B' : '#10B981'} 
                    />
                  ))}
                </Bar>
             </BarChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* Advisory Footer */}
      <Card className="p-8 border-dashed border-2 flex items-center gap-6 bg-surface/50">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-soft">
          <Info size={32} />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-black text-ink italic mb-1">Conseil du Chef</h4>
          <p className="text-ink-secondary font-medium italic">"Pour un service en moins de 10 minutes, nous vous conseillons de passer commande avant 11:45 ou après 13:15."</p>
        </div>
        <Link to="/student/order">
          <Button className="rounded-[20px] font-black italic px-8">COMMANDER MAINTENANT</Button>
        </Link>
      </Card>
    </div>
  );
}
