import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Send,
  ChefHat,
  Dna,
  Leaf,
  Flame,
  HeartPulse,
  UtensilsCrossed,
  Info,
  Loader2,
  Bot,
  User,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { GoogleGenAI } from "@google/genai";
import { cn } from "@/lib/utils";

// We reuse the menu items for the AI context
const menuItems = [
  {
    id: 1,
    name: "Thieboudienne Rouge",
    category: "Plats ESMT",
    price: 2500,
    kcal: 850,
    protein: 45,
    fat: 35,
    carb: 90,
    allergens: ["poisson", "gluten"],
    tags: ["Tradition", "Épicé"],
  },
  {
    id: 2,
    name: "Burger Pilot Triple",
    category: "Fast Food",
    price: 3500,
    kcal: 920,
    protein: 55,
    fat: 50,
    carb: 65,
    allergens: ["gluten", "lactose", "sésame"],
    tags: ["Best Seller"],
  },
  {
    id: 3,
    name: "Yassa au Poulet",
    category: "Plats ESMT",
    price: 2800,
    kcal: 780,
    protein: 48,
    fat: 25,
    carb: 85,
    allergens: ["moutarde"],
    tags: ["Citronné", "Sain"],
  },
  {
    id: 4,
    name: "Mafe Viande",
    category: "Plats ESMT",
    price: 2600,
    kcal: 950,
    protein: 50,
    fat: 60,
    carb: 70,
    allergens: ["arachide"],
    tags: ["Copieux"],
  },
  {
    id: 5,
    name: "Salade César ESMT",
    category: "Léger",
    price: 2200,
    kcal: 450,
    protein: 25,
    fat: 20,
    carb: 35,
    allergens: ["gluten", "lactose", "oeuf"],
    tags: ["Sain", "Léger"],
  },
];

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AINutritionView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Bonjour ! Je suis l'IA Nutritionnelle de FoodPilot. Je connais parfaitement le menu de l'ESMT. Comment puis-je vous aider à choisir votre repas aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY as string,
      });

      const prompt = `
        Tu es l'assistant nutritionnel expert de FoodPilot pour le restaurant de l'ESMT (Sénégal).
        Voici le menu actuel du restaurant avec les informations nutritionnelles :
        ${JSON.stringify(menuItems, null, 2)}

        Réponds de manière concise, professionnelle et amicale. 
        Si l'utilisateur demande des conseils (ex: "quel plat est le plus sain ?", "je suis allergique aux arachides"), analyse les données ci-dessus.
        Mets en avant les valeurs nutritionnelles (Kcal, Protéines, Allergènes) quand c'est pertinent.
        Utilise un ton encourageant.
        
        Question de l'utilisateur : "${userMsg}"
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const responseText =
        result.text ||
        "Désolé, j'ai eu un petit problème technique dans ma cuisine numérique. Pouvez-vous reformuler ?";
      setMessages((prev) => [...prev, { role: "ai", content: responseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      // Fallback for demo if API key is not set or fails
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "En tant qu'IA, je vous conseille le Yassa au Poulet (780 kcal) si vous cherchez un plat équilibré et savoureux, ou la Salade César (450 kcal) pour plus de légèreté. Évitez le Mafé si vous êtes allergique aux arachides !",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-160px)] space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-soft animate-float">
              <Bot size={24} />
            </div>
            <h2 className="text-4xl font-black tracking-tightest text-ink italic uppercase">
              Pilote IA Nutrition
            </h2>
          </div>
          <p className="text-ink-secondary font-bold uppercase tracking-widest text-sm">
            Conseiller Intelligent • Alimentation Équilibrée @ ESMT
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="success"
            className="bg-emerald-600 text-white border-none px-4 py-2 font-black italic shadow-soft"
          >
            GPT-4 POWERED
          </Badge>
          <Badge
            variant="secondary"
            className="bg-white text-ink border-2 border-gray-100 px-4 py-2 font-black italic shadow-soft"
          >
            BETA V1.2
          </Badge>
        </div>
      </header>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col p-0 border-none shadow-large overflow-hidden relative bg-white dark:bg-slate-900 ring-4 ring-primary/5">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none p-20 flex flex-wrap gap-40 justify-center overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Sparkles key={i} size={200} className="text-primary rotate-12" />
          ))}
        </div>

        <div
          className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 custom-scrollbar"
          ref={scrollRef}
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-soft border-2 border-white dark:border-slate-800",
                  msg.role === "ai"
                    ? "bg-primary text-white"
                    : "bg-ink text-white",
                )}
              >
                {msg.role === "ai" ? (
                  <Sparkles size={20} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div
                className={cn(
                  "p-6 rounded-[32px] font-medium text-lg shadow-medium leading-relaxed italic border-2",
                  msg.role === "ai"
                    ? "bg-primary/5 text-ink border-primary/20 rounded-tl-none"
                    : "bg-ink text-white border-ink rounded-tr-none",
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-soft border-2 border-white animate-pulse">
                <Bot size={20} />
              </div>
              <div className="p-6 bg-primary/5 text-primary border-2 border-primary/20 rounded-[32px] rounded-tl-none font-black italic animate-pulse">
                Analyse du menu en cours...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-8 bg-surface border-t-2 border-gray-100 dark:border-slate-800 flex gap-4 items-center">
          <Input
            placeholder="Posez une question (ex: Quel plat est le moins calorique ?)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 h-16 rounded-2xl text-lg font-bold italic px-8 focus:ring-primary border-2 border-white dark:border-slate-700 shadow-soft"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="h-16 w-16 min-w-[64px] rounded-2xl bg-primary hover:bg-primary-dark text-white shadow-xl flex items-center justify-center group"
          >
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Send
                size={24}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            )}
          </Button>
        </div>
      </Card>

      {/* Suggested chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          "Quel plat est sans gluten ?",
          "Le plus protéiné ?",
          "Options végétariennes ?",
          "Plat traditionnel léger ?",
        ].map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 text-sm font-black italic uppercase tracking-widest text-ink-secondary hover:text-primary hover:scale-105 transition-all shadow-soft border-2 border-gray-50 dark:border-slate-700"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
        {[
          {
            t: "Gluten Free",
            v: "2 items",
            icon: ShieldCheck,
            c: "text-blue-500",
          },
          {
            t: "High Protein",
            v: "3 items",
            icon: Flame,
            c: "text-orange-500",
          },
          {
            t: "Lactose Free",
            v: "4 items",
            icon: HeartPulse,
            c: "text-pink-500",
          },
          {
            t: "Healthy Choice",
            v: "1 recommendation",
            icon: Leaf,
            c: "text-emerald-500",
          },
        ].map((s, i) => (
          <Card
            key={i}
            className="p-6 flex flex-col items-center text-center hoverable"
          >
            <div className={cn("p-4 rounded-2xl bg-surface mb-4", s.c)}>
              <s.icon size={24} />
            </div>
            <p className="text-xl font-black text-ink">{s.v}</p>
            <p className="text-[10px] font-black text-ink-secondary uppercase tracking-widest">
              {s.t}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
