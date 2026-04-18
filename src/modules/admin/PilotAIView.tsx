import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Box } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function PilotAIView() {
  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-5xl font-black tracking-tight text-ink italic uppercase">
          Pilotage IA
        </h2>
        <p className="text-base font-bold text-ink-secondary uppercase tracking-widest mt-1">
          Suggestions et analyses prédictives
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 bg-indigo-50 border-indigo-100">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
             <TrendingUp size={24} />
          </div>
          <h3 className="font-bold text-lg text-ink mb-2">Augmenter production à 12h30</h3>
          <p className="text-sm font-medium text-ink-secondary mb-6">
            L'analyse des emplois du temps indique un afflux massif d'étudiants. Prévoyez 30% de portions supplémentaires.
          </p>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Appliquer</Button>
        </Card>

        <Card className="p-8 bg-amber-50 border-amber-100">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
             <Box size={24} />
          </div>
          <h3 className="font-bold text-lg text-ink mb-2">Réduire préparation du Yassa</h3>
          <p className="text-sm font-medium text-ink-secondary mb-6">
            La demande pour le Yassa est en baisse aujourd'hui. Réduisez la préparation pour éviter le surstock.
          </p>
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">Ajuster Stocks</Button>
        </Card>

        <Card className="p-8 bg-emerald-50 border-emerald-100">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
             <Lightbulb size={24} />
          </div>
          <h3 className="font-bold text-lg text-ink mb-2">Créer menu anti-gaspillage</h3>
          <p className="text-sm font-medium text-ink-secondary mb-6">
            Il reste 15kg d'oignons proches de la limite. Un menu spécial oignons pourrait écouler ce stock.
          </p>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Générer Menu</Button>
        </Card>
      </div>

      <Card className="p-8 border-none shadow-large relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12">
          <Sparkles size={160} />
        </div>
        <div className="flex items-center gap-4 mb-8">
           <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-white shadow-soft">
              <Sparkles size={32} />
           </div>
           <div>
             <h3 className="text-2xl font-black tracking-tight text-ink">Assistant Pilot</h3>
             <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest">IA Conversationnelle</p>
           </div>
        </div>
        <div className="bg-surface rounded-3xl p-6 h-64 flex flex-col justify-end">
           <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                 <Sparkles size={20} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm font-medium text-ink">
                 Bonjour ! Je suis l'IA de FoodPilot. Je surveille actuellement vos stocks et vos commandes. Que souhaitez-vous analyser ?
              </div>
           </div>
        </div>
        <div className="mt-4 flex gap-3">
           <input 
             type="text" 
             placeholder="Demandez une analyse..." 
             className="flex-1 h-14 bg-surface rounded-2xl px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/20"
           />
           <Button className="h-14 px-8 rounded-2xl bg-ink hover:bg-slate-800 text-white font-bold">
             Analyser
           </Button>
        </div>
      </Card>
    </div>
  );
}
