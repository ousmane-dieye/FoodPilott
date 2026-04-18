import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const flowData = [
  { time: "11:30", students: 45, status: "fluide" },
  { time: "12:00", students: 120, status: "modere" },
  { time: "12:30", students: 280, status: "sature" },
  { time: "13:00", students: 310, status: "sature" },
  { time: "13:30", students: 150, status: "modere" },
  { time: "14:00", students: 60, status: "fluide" },
];

const getColor = (status: string) => {
  if (status === "fluide") return "#10B981"; // emerald-500
  if (status === "modere") return "#F59E0B"; // amber-500
  return "#EF4444"; // red-500
};

export default function FluxView() {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-5xl font-black tracking-tight text-ink italic uppercase">
          Flux du Restaurant
        </h2>
        <p className="text-base font-bold text-ink-secondary uppercase tracking-widest mt-1">
          Analyse de la fréquentation par créneaux
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 h-[500px]">
          <div className="mb-8">
            <h3 className="font-bold text-2xl text-ink tracking-tight">Affluence par Tranche Horaire</h3>
            <p className="text-base font-medium text-ink-secondary">Nombre de personnes attendues (prédictions et réservations)</p>
          </div>
          <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: "#94A3B8" }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: 800 }}
                />
                <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                  {flowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="font-bold text-xl text-ink tracking-tight mb-6 flex items-center gap-2">
              <Clock size={20} className="text-primary"/> Périodes Critiques
            </h3>
            <div className="space-y-4">
               {flowData.filter(d => d.status === "sature").map((d, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div>
                      <p className="font-black text-red-600 text-lg">{d.time}</p>
                      <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Surcharge Prévue</p>
                    </div>
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                       <Users size={16}/>
                       <span>{d.students} pers.</span>
                    </div>
                 </div>
               ))}
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="font-bold text-xl text-ink tracking-tight mb-6">Légende</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm" />
                   <span className="font-bold text-ink">Fluide</span>
                 </div>
                 <span className="text-sm font-medium text-ink-secondary">&lt; 100 pers.</span>
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full bg-amber-500 shadow-sm" />
                   <span className="font-bold text-ink">Modéré</span>
                 </div>
                 <span className="text-sm font-medium text-ink-secondary">100 - 200 pers.</span>
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm" />
                   <span className="font-bold text-ink">Saturé</span>
                 </div>
                 <span className="text-sm font-medium text-ink-secondary">&gt; 200 pers.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
