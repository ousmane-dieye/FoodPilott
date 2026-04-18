import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Clock,
  ShieldCheck,
  Trophy,
  Sparkles,
  Leaf,
  LayoutGrid,
  MessageSquare,
  ArrowRight,
  Plus,
  Minus,
  Search,
  Filter,
  Star,
  Info,
  ChevronLeft,
  CreditCard,
  Wallet,
  Banknote,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  Clock3,
  Send,
  Flame,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { MockOrderService } from "@/services/simulation";
import { DataService } from "@/services/data";
import { Review } from "@/types";
import { AuthService } from "@/services/auth";

// Views
import AffluenceView from "./student/AffluenceView";
import AINutritionView from "./student/AINutritionView";
import FidelityView from "./student/FidelityView";

// UI Components
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

// Mock Data
export const categories = [
  "Tous",
  "Plats ESMT",
  "Fast Food",
  "Petit Déj",
  "Desserts",
  "Boissons",
];
export const menuItems = [
  {
    id: 1,
    name: "Thieboudienne Rouge",
    category: "Plats ESMT",
    price: 2500,
    rating: 4.9,
    time: "15 min",
    img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=2074&auto=format&fit=crop",
    kcal: 850,
    tags: ["Tradition", "Épicé"],
  },
  {
    id: 2,
    name: "Dibi Agneau",
    category: "Plats ESMT",
    price: 3500,
    rating: 4.9,
    time: "25 min",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
    kcal: 920,
    tags: ["Grillade", "Premium"],
  },
  {
    id: 3,
    name: "Yassa au Poulet",
    category: "Plats ESMT",
    price: 2800,
    rating: 4.7,
    time: "20 min",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1913&auto=format&fit=crop",
    kcal: 780,
    tags: ["Citronné", "Sain"],
  },
  {
    id: 4,
    name: "Mafé à la Viande",
    category: "Plats ESMT",
    price: 2600,
    rating: 4.6,
    time: "25 min",
    img: "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=1974&auto=format&fit=crop",
    kcal: 950,
    tags: ["Sénégalais", "Copieux"],
  },
  {
    id: 5,
    name: "Pastels Tradition",
    category: "Petit Déj",
    price: 1500,
    rating: 4.8,
    time: "10 min",
    img: "https://images.unsplash.com/photo-1628198751543-98fe85890b0c?q=80&w=2070&auto=format&fit=crop",
    kcal: 450,
    tags: ["Croquant", "Snack"],
  },
  {
    id: 6,
    name: "Salade Fraîcheur",
    category: "Petit Déj",
    price: 2200,
    rating: 4.6,
    time: "8 min",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    kcal: 400,
    tags: ["Sain", "Léger"],
  },
];

export default function StudentApp() {
  return (
    <Routes>
      <Route path="order" element={<OrderView />} />
      <Route path="history" element={<HistoryView />} />
      <Route path="fidelity" element={<FidelityView />} />
      <Route path="affluence" element={<AffluenceView />} />
      <Route path="ai" element={<AINutritionView />} />
      <Route path="profile" element={<ProfileView />} />
      <Route path="*" element={<OrderView />} />
    </Routes>
  );
}

function OrderView() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [search, setSearch] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string>("12:00");
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "wave" | "orange_money" | "cash"
  >("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "select" | "processing" | "success" | "failed"
  >("select");
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [reviewCounts, setReviewCounts] = useState<Record<number, number>>({});
  const [selectedItemReviews, setSelectedItemReviews] = useState<{
    name: string;
    reviews: Review[];
  } | null>(null);

  const { user } = useAuthStore();

  React.useEffect(() => {
    // Sync ratings from Firestore instead of mock
    menuItems.forEach(async (item) => {
      const revs = await DataService.getReviews(String(item.id));
      if (revs.length > 0) {
        const sum = revs.reduce((acc, r) => acc + r.rating, 0);
        setRatings((prev) => ({
          ...prev,
          [item.id]: Number((sum / revs.length).toFixed(1)),
        }));
        setReviewCounts((prev) => ({ ...prev, [item.id]: revs.length }));
      } else {
        setRatings((prev) => ({ ...prev, [item.id]: 0 }));
        setReviewCounts((prev) => ({ ...prev, [item.id]: 0 }));
      }
    });
  }, []);

  const slots = [
    {
      time: "11:45",
      affluence: "low",
      label: "Libre",
      desc: "Service rapide",
      bonus: 20,
    },
    {
      time: "12:00",
      affluence: "high",
      label: "Pointe",
      desc: "Attente longue",
      bonus: 0,
    },
    {
      time: "12:30",
      affluence: "medium",
      label: "Modéré",
      desc: "Attente standard",
      bonus: 0,
    },
    {
      time: "13:00",
      affluence: "low",
      label: "Libre",
      desc: "Service rapide",
      bonus: 15,
    },
  ];

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "Tous" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const cartCount = Object.values(cart).reduce(
    (a: number, b: number) => a + b,
    0,
  );
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((it) => it.id === Number(id));
    return sum + (item?.price || 0) * (qty as number);
  }, 0);

  const updateCart = (id: number, delta: number) => {
    setCart((prev) => {
      const news = { ...prev };
      news[id] = ((news[id] as number) || 0) + delta;
      if (news[id] <= 0) delete news[id];
      return news;
    });
  };

  const handleOrderSubmit = async () => {
    if (Object.keys(cart).length === 0) return;
    setIsProcessing(true);
    setPaymentStep("processing");
    setTimeout(async () => {
      try {
        const isSuccess = Math.random() < 0.9;
        if (!isSuccess && paymentMethod !== "cash")
          throw new Error("Transaction refusée.");
        MockOrderService.createOrder({
          userId: user?.uid || "demo_user",
          items: Object.entries(cart).map(([id, qty]) => {
            const it = menuItems.find((m) => m.id === Number(id));
            return {
              id: String(it?.id),
              name: it?.name,
              price: it?.price,
              quantity: qty,
            };
          }),
          total,
          slot: selectedSlot,
          paymentMethod,
          paymentStatus: paymentMethod === "cash" ? "cash_pending" : "paid",
        });
        setPaymentStep("success");
        setIsProcessing(false);
        setCart({});
        toast.success("Commande validée !");
      } catch (e: any) {
        toast.error(e.message);
        setPaymentStep("failed");
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:max-w-md">
            <Input
              placeholder="Rechercher un plat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={20} />}
              className="rounded-2xl h-14"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
            {categories.map((c) => (
              <Button
                key={c}
                variant={selectedCategory === c ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(c)}
                className="whitespace-nowrap px-6 h-12 rounded-xl font-bold"
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <Card className="p-8 bg-surface/40 backdrop-blur-xl border-dashed border-2">
          <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between">
            <div>
              <h4 className="text-xl font-black italic uppercase tracking-tight text-ink mb-1">
                Passage en salle
              </h4>
              <p className="text-sm font-medium text-ink-secondary uppercase tracking-widest">
                Optimisez votre temps à l'ESMT
              </p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {slots.map((s) => (
                <button
                  key={s.time}
                  onClick={() => setSelectedSlot(s.time)}
                  className={cn(
                    "flex flex-col items-center p-5 rounded-3xl min-w-[120px] transition-all border-2",
                    selectedSlot === s.time
                      ? "bg-primary text-white border-primary shadow-large scale-105"
                      : "bg-white text-ink border-gray-100 dark:border-slate-800 hover:border-primary/40",
                  )}
                >
                  <span className="text-2xl font-black italic">{s.time}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        s.affluence === "high"
                          ? "bg-red-500"
                          : s.affluence === "medium"
                            ? "bg-amber-500"
                            : "bg-emerald-500",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        selectedSlot === s.time
                          ? "text-white/80"
                          : "text-ink-secondary",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="col-span-1 p-0 overflow-hidden group hoverable border border-gray-100 shadow-medium bg-white">
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={item.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1913&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      className="bg-white text-ink border-none shadow-medium py-2 px-4 rounded-2xl flex items-center gap-2 font-black cursor-pointer hover:scale-105 transition-transform"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const revs = await DataService.getReviews(
                          String(item.id),
                        );
                        setSelectedItemReviews({
                          name: item.name,
                          reviews: revs,
                        });
                      }}
                    >
                      <Star
                        size={16}
                        className={cn(
                          "",
                          (ratings[item.id] || item.rating) > 0
                            ? "fill-amber-500 text-amber-500"
                            : "text-gray-300",
                        )}
                      />
                      <span className="text-base">
                        {ratings[item.id]?.toFixed(1) || item.rating}
                      </span>
                      <span className="text-xs text-ink-secondary font-bold">
                        ({reviewCounts[item.id] || 0})
                      </span>
                    </button>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <div className="flex gap-2 flex-wrap">
                      {item.tags.map((t) => (
                        <Badge
                          key={t}
                          className="bg-primary text-white border-none py-1.5 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-soft"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-3xl font-black tracking-tight text-ink italic uppercase leading-none">
                      {item.name}
                    </h3>
                    <span className="text-2xl font-black text-primary italic whitespace-nowrap">
                      {item.price} F
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-[11px] font-black text-ink-secondary uppercase tracking-widest mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-primary" /> {item.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf size={16} className="text-emerald-600" />{" "}
                      {item.kcal} KCAL
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {((cart[item.id] as number) || 0) > 0 ? (
                      <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-2 ring-1 ring-gray-200 shadow-inner w-full justify-between">
                        <button
                          onClick={() => updateCart(item.id, -1)}
                          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-ink shadow-soft hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-gray-200"
                        >
                          <Minus size={20} />
                        </button>
                        <span className="text-2xl font-black italic">
                          {cart[item.id]}
                        </span>
                        <button
                          onClick={() => updateCart(item.id, 1)}
                          className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-white shadow-soft hover:bg-primary-dark transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full h-16 rounded-[20px] font-black italic text-lg shadow-medium"
                        onClick={() => updateCart(item.id, 1)}
                      >
                        AJOUTER AU PANIER
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {(cartCount as number) > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-28 md:bottom-12 right-6 left-6 md:left-auto md:w-96 z-[60]"
        >
          <Card className="bg-ink text-white p-8 shadow-3xl border-none rounded-[40px] relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
                  <ShoppingBag size={28} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">
                    Mon Panier
                  </p>
                  <h4 className="text-3xl font-black tracking-tightest italic">
                    {total} F
                  </h4>
                  <p className="text-xs font-bold text-emerald-400 mt-1">
                    {cartCount} ARTICLES
                  </p>
                </div>
              </div>
              <Button
                className="bg-primary text-white hover:bg-primary-dark border-none px-6 h-14 rounded-2xl font-black italic shadow-xl"
                onClick={() => {
                  setShowCheckout(true);
                  setPaymentStep("select");
                }}
              >
                PAYER <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Checkout Modal */}
      <AnimatePresence>
        {selectedItemReviews && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] overflow-hidden shadow-3xl"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-black italic uppercase text-ink">
                    Avis : {selectedItemReviews.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedItemReviews(null)}
                    className="rounded-xl"
                  >
                    <XCircle size={24} />
                  </Button>
                </div>

                <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                  {selectedItemReviews.reviews.length === 0 ? (
                    <div className="text-center py-10 opacity-30">
                      <MessageSquare size={48} className="mx-auto mb-4" />
                      <p className="font-bold uppercase tracking-widest">
                        Aucun commentaire pour le moment
                      </p>
                    </div>
                  ) : (
                    selectedItemReviews.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-6 bg-surface dark:bg-slate-800 rounded-3xl border-2 border-gray-50 dark:border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase shadow-soft">
                              {(rev.userName || "A").charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black uppercase text-ink italic">
                                {rev.userName || "Anonyme"}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">
                                {rev.createdAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-soft">
                            <Star
                              size={12}
                              className="fill-amber-500 text-amber-500"
                            />
                            <span className="text-xs font-black">
                              {rev.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-ink-secondary leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[56px] overflow-hidden shadow-3xl border-2 border-white/20"
            >
              {paymentStep === "select" ? (
                <div className="p-12">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h3 className="text-4xl font-black text-ink tracking-tight italic uppercase">
                        Checkout
                      </h3>
                      <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest mt-1">
                        Terminal de paiement sécurisé
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCheckout(false)}
                      className="rounded-2xl w-12 h-12 bg-slate-100"
                    >
                      <Minus size={24} />
                    </Button>
                  </div>

                  <div className="space-y-4 mb-12">
                    {[
                      {
                        id: "wave",
                        label: "Wave",
                        icon: Wallet,
                        color: "text-cyan-500",
                        bg: "bg-cyan-50",
                      },
                      {
                        id: "orange_money",
                        label: "Orange Money",
                        icon: CreditCard,
                        color: "text-orange-500",
                        bg: "bg-orange-50",
                      },
                      {
                        id: "cash",
                        label: "Espèces (Borne)",
                        icon: Banknote,
                        color: "text-emerald-500",
                        bg: "bg-emerald-50",
                      },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={cn(
                          "w-full flex items-center gap-6 p-6 rounded-[32px] transition-all border-4",
                          paymentMethod === method.id
                            ? "border-primary bg-primary/5 scale-[1.02]"
                            : "border-slate-50 dark:border-slate-800 hover:border-primary/20 bg-slate-50/50",
                        )}
                      >
                        <div
                          className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-soft",
                            method.bg,
                            method.color,
                          )}
                        >
                          <method.icon size={32} />
                        </div>
                        <div className="text-left">
                          <p className="text-xl font-black text-ink italic uppercase">
                            {method.label}
                          </p>
                          <p className="text-xs font-bold text-ink-secondary tracking-widest">
                            PAIEMENT INSTANTANÉ
                          </p>
                        </div>
                        {paymentMethod === method.id && (
                          <div className="ml-auto w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-soft">
                            <CheckCircle2 size={20} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-6 pt-8 border-t-4 border-dashed border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-ink-secondary uppercase italic">
                        Total Commande
                      </span>
                      <span className="text-5xl font-black text-primary italic">
                        {total} F
                      </span>
                    </div>
                    <Button
                      className="w-full h-20 rounded-[28px] text-xl font-black italic uppercase italic shadow-2xl"
                      onClick={handleOrderSubmit}
                    >
                      Confirmer & Payer
                    </Button>
                  </div>
                </div>
              ) : paymentStep === "processing" ? (
                <div className="p-16 text-center py-24">
                  <div className="w-24 h-24 bg-primary/20 rounded-[40px] flex items-center justify-center mx-auto mb-10 relative">
                    <div className="absolute inset-0 border-8 border-primary rounded-[40px] animate-ping opacity-20" />
                    <Loader2 size={48} className="text-primary animate-spin" />
                  </div>
                  <h3 className="text-4xl font-black text-ink mb-4 italic uppercase">
                    Traitement...
                  </h3>
                  <p className="text-lg text-ink-secondary font-bold uppercase tracking-widest max-w-xs mx-auto">
                    Sécurisation de la transaction via{" "}
                    {paymentMethod.toUpperCase()}
                  </p>
                </div>
              ) : paymentStep === "success" ? (
                <div className="p-16 text-center py-24">
                  <div className="w-24 h-24 bg-emerald-500 rounded-[40px] flex items-center justify-center mx-auto mb-10 text-white shadow-large scale-125">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-4xl font-black text-ink mb-4 italic uppercase">
                    Validé !
                  </h3>
                  <p className="text-lg text-ink-secondary font-bold uppercase tracking-widest mb-12">
                    Votre repas est en cuisine. Bon appétit !
                  </p>
                  <Button
                    className="w-full h-16 rounded-[24px] font-black italic"
                    onClick={() => setShowCheckout(false)}
                  >
                    RETOUR AU MENU
                  </Button>
                </div>
              ) : (
                <div className="p-16 text-center py-24">
                  <div className="w-24 h-24 bg-red-500 rounded-[40px] flex items-center justify-center mx-auto mb-10 text-white shadow-large scale-125">
                    <XCircle size={48} />
                  </div>
                  <h3 className="text-4xl font-black text-ink mb-4 italic uppercase">
                    Erreur
                  </h3>
                  <p className="text-lg text-ink-secondary font-bold uppercase tracking-widest mb-12">
                    La transaction a échoué.
                  </p>
                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      className="flex-1 h-16 rounded-2xl font-black"
                      onClick={() => setPaymentStep("select")}
                    >
                      RÉESSAYER
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 h-16 rounded-2xl font-black"
                      onClick={() => setShowCheckout(false)}
                    >
                      ANNULER
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HistoryView() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [ratingOrder, setRatingOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const { user, profile } = useAuthStore();

  const [reviewForm, setReviewForm] = useState({
    itemId: 0,
    itemName: "",
    rating: 5,
    comment: "",
  });

  React.useEffect(() => {
    if (!user) return;
    return MockOrderService.subscribeToOrders((data) => {
      const myOrders = data.filter((o) => o.userId === user.uid);
      setOrders(myOrders);
    });
  }, [user]);

  const submitReview = async () => {
    if (!reviewForm.comment.trim()) {
      toast.error("Veuillez laisser un petit commentaire !");
      return;
    }
    if (!user) {
      toast.error("Vous devez être connecté pour laisser un avis.");
      return;
    }

    try {
      await DataService.addReview({
        menuItemId: String(reviewForm.itemId),
        userId: user.uid,
        userName: profile?.displayName || user?.displayName || "Anonyme",
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success("Merci ! Votre avis a été enregistré.");
      setRatingOrder(null);
      setReviewForm({ itemId: 0, itemName: "", rating: 5, comment: "" });
    } catch (err) {
      toast.error("Erreur lors de l'envoi de l'avis.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tightest text-ink italic uppercase">
            Commandes
          </h2>
          <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest mt-1">
            Historique & Suivi Live
          </p>
        </div>
        <Badge
          variant="secondary"
          className="px-8 py-3 rounded-2xl bg-surface text-ink font-black italic border-2 border-gray-100"
        >
          FILTRER
        </Badge>
      </header>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-32 bg-surface/50 rounded-[48px] border-4 border-dashed border-gray-100">
            <ShoppingBag size={80} className="mx-auto text-gray-200 mb-6" />
            <p className="text-2xl font-black text-gray-300 italic uppercase">
              Aucune commande
            </p>
          </div>
        ) : (
          orders.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hoverable p-6 md:p-8 border border-gray-200 shadow-soft bg-white group hover:border-primary/50 transition-all">
                <div className="flex flex-col gap-6">
                  {/* Top Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-soft relative overflow-hidden shrink-0",
                          ["ready", "completed", "served"].includes(o.status)
                            ? "bg-emerald-50 text-emerald-500"
                            : ["preparing", "pending"].includes(o.status)
                              ? "bg-orange-50 text-orange-500"
                              : "bg-red-50 text-red-500",
                        )}
                      >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                        {["ready", "completed", "served"].includes(o.status) ? (
                          <CheckCircle2 size={32} />
                        ) : (
                          <Clock
                            size={32}
                            className="animate-spin"
                            style={{ animationDuration: "8s" }}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <h4 className="font-black text-2xl tracking-tight text-ink italic">
                            ORDRE #{o.id.slice(-4).toUpperCase()}
                          </h4>
                          <Badge
                            className={cn(
                              "px-3 py-1 font-black uppercase tracking-widest border-none text-[10px]",
                              ["served", "completed"].includes(o.status)
                                ? "bg-slate-100 text-slate-500"
                                : o.status === "ready"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-orange-500 text-white",
                            )}
                          >
                            {["served", "completed"].includes(o.status)
                              ? "REMIS"
                              : o.status === "ready"
                                ? "PRÊT"
                                : "EN COURS"}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest flex items-center gap-2">
                          <Clock3 size={14} className="text-primary"/> {o.createdAt} • {o.items?.length || 0} ARTICLES
                        </p>
                      </div>
                    </div>
                    <div className="text-left md:text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                      <p className="text-3xl font-black text-primary italic tracking-tightest">
                        {o.total} F
                      </p>
                      {(o.status === "ready" || o.status === "preparing" || o.status === "pending") && (
                        <Button
                          className="bg-ink text-white hover:bg-slate-800 rounded-xl px-6 h-10 font-black italic uppercase tracking-widest text-[10px] shadow-soft"
                          onClick={() => setSelectedOrder(o)}
                        >
                          QR CODE
                        </Button>
                      )}
                      {(o.status === "served" || o.status === "completed") && (
                        <Button
                          variant="secondary"
                          className="rounded-xl px-6 h-10 font-black italic uppercase tracking-widest text-[10px] shadow-soft border-2 border-primary/20 text-primary"
                          onClick={() => {
                            const firstItem = o.items[0];
                            setReviewForm({
                              itemId: Number(firstItem.id),
                              itemName: firstItem.name,
                              rating: 5,
                              comment: "",
                            });
                            setRatingOrder(o);
                          }}
                        >
                          NOTER
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Visual Tracker */}
                  <div className="mt-4 pt-6 border-t border-gray-100 relative">
                    <div className="absolute top-10 left-0 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-primary"
                         initial={{ width: 0 }}
                         animate={{ width: o.status === 'pending' ? '25%' : o.status === 'preparing' ? '50%' : o.status === 'ready' ? '75%' : '100%' }}
                         transition={{ duration: 0.8, ease: "easeInOut" }}
                       />
                    </div>
                    
                    <div className="flex justify-between relative z-10">
                      {[
                        { step: 'pending', label: 'Reçue', icon: Send },
                        { step: 'preparing', label: 'Cuisine', icon: Flame },
                        { step: 'ready', label: 'Prête', icon: Package },
                        { step: 'served', label: 'Livrée', icon: CheckCircle2 }
                      ].map((s, idx) => {
                        const isReached = 
                          (o.status === 'served' || o.status === 'completed') ? true :
                          (o.status === 'ready' && idx <= 2) ? true :
                          (o.status === 'preparing' && idx <= 1) ? true :
                          (o.status === 'pending' && idx === 0) ? true : false;
                          
                        const isCurrent = o.status === s.step || (o.status === 'completed' && s.step === 'served');

                        return (
                          <div key={s.step} className="flex flex-col items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                              isCurrent ? "bg-primary text-white shadow-soft ring-4 ring-primary/20 scale-110" :
                              isReached ? "bg-primary text-white" : "bg-white text-gray-300 border-2 border-gray-100"
                            )}>
                              <s.icon size={18} />
                            </div>
                            <span className={cn(
                              "text-xs font-bold uppercase tracking-widest transition-colors",
                              isCurrent ? "text-primary" :
                              isReached ? "text-ink" : "text-gray-400"
                            )}>
                              {s.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {ratingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[48px] overflow-hidden shadow-3xl text-center p-12"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="text-left">
                  <h3 className="text-3xl font-black italic uppercase text-ink">
                    Évaluer
                  </h3>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest">
                    {reviewForm.itemName}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRatingOrder(null)}
                  className="rounded-xl"
                >
                  <XCircle size={24} />
                </Button>
              </div>

              <div className="mb-10 flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setReviewForm((prev) => ({ ...prev, rating: star }))
                    }
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-soft",
                      reviewForm.rating >= star
                        ? "bg-primary text-white scale-110"
                        : "bg-slate-50 text-slate-300",
                    )}
                  >
                    <Star
                      size={28}
                      className={reviewForm.rating >= star ? "fill-white" : ""}
                    />
                  </button>
                ))}
              </div>

              <div className="mb-10">
                <Input
                  placeholder="Votre avis sur ce plat..."
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  className="h-24 rounded-[32px] text-lg font-bold italic px-8 focus:ring-primary border-4 border-slate-50 dark:border-slate-800"
                />
              </div>

              <Button
                className="w-full h-16 rounded-[24px] font-black italic uppercase tracking-widest text-lg shadow-xl"
                onClick={submitReview}
              >
                ENVOYER L'AVIS
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white dark:bg-slate-900 rounded-[64px] p-16 max-w-md w-full text-center relative shadow-3xl border-2 border-white/20"
            >
              <Button
                variant="ghost"
                className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-slate-50"
                onClick={() => setSelectedOrder(null)}
              >
                <XCircle size={32} />
              </Button>
              <h3 className="text-5xl font-black tracking-tightest mb-4 italic uppercase text-slate-900 dark:text-white">
                SCAN PILOT
              </h3>
              <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest mb-12">
                VOTRE PASSE DE RETRAIT • ID {selectedOrder.id}
              </p>

              <div className="bg-white p-10 rounded-[48px] inline-block shadow-2xl mb-12 ring-[20px] ring-primary/5">
                <QRCodeCanvas
                  value={selectedOrder.qrData || JSON.stringify(selectedOrder)}
                  size={240}
                  fgColor="#00A86B"
                />
              </div>

              <div className="space-y-4">
                <p className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                  Activez le scanner du terminal
                </p>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black italic px-4 py-2">
                  RÉCUPÉRATION IMMÉDIATE
                </Badge>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileView() {
  const { user, profile } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "Ousmane",
    lastName: profile?.lastName || "Dieng",
    pref: profile?.role === "STUDENT" ? "Standard" : "Standard",
    allergies: profile?.allergies?.join(", ") || "Aucune",
  });

  return (
    <div className="max-w-5xl mx-auto space-y-16">
      <header className="flex flex-col md:flex-row gap-12 items-center md:items-end p-12 bg-white dark:bg-slate-900 rounded-[56px] shadow-large border-b-8 border-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 rotate-45 pointer-events-none">
          <User size={300} />
        </div>
        <div className="relative group z-10">
          <div className="w-48 h-48 rounded-[48px] bg-gradient-to-br from-primary via-emerald-400 to-indigo-500 p-1.5 shadow-2xl">
            <div className="w-full h-full rounded-[46px] bg-background flex items-center justify-center overflow-hidden border-4 border-white">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 180 }}
            className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-primary text-primary"
          >
            <Sparkles size={32} />
          </motion.div>
        </div>
        <div className="text-center md:text-left relative z-10 flex-1">
          <h2 className="text-6xl font-black tracking-tightest text-ink mb-6 italic uppercase">
            {formData.firstName} {formData.lastName}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <Badge className="bg-primary text-white border-none px-8 h-12 text-sm font-black uppercase tracking-widest shadow-lg">
              {profile?.role || "STUDENT"}
            </Badge>
            <div className="flex items-center gap-3 text-lg font-black text-ink-secondary uppercase tracking-widest italic">
              <Clock size={20} className="text-primary" /> Membre Gold • Exp:
              2027
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <Card className="lg:col-span-2 p-12 border-none shadow-large">
          <h3 className="text-3xl font-black tracking-tightest italic uppercase mb-12 pb-6 border-b-2 border-slate-50">
            Identité & Food-Pref
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="Prénom"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="h-16 rounded-2xl text-xl font-black italic"
            />
            <Input
              label="Nom"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="h-16 rounded-2xl text-xl font-black italic"
            />
            <Input
              label="Email"
              value={user?.email || ""}
              readOnly
              disabled
              className="h-16 rounded-2xl bg-surface/50 opacity-50 font-mono"
            />
            <Input
              label="Téléphone"
              placeholder="+221 77..."
              className="h-16 rounded-2xl text-xl font-black"
            />
          </div>

          <div className="mt-16 pt-12 border-t-2 border-slate-50">
            <h3 className="text-3xl font-black tracking-tightest italic uppercase mb-8 flex items-center gap-3">
              <Leaf className="text-emerald-500" /> Profil Diététique
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Régime Spécifique"
                value={formData.pref}
                onChange={(e) =>
                  setFormData({ ...formData, pref: e.target.value })
                }
                className="h-16 rounded-2xl text-xl font-black italic"
              />
              <Input
                label="Allergies / Intolérances"
                value={formData.allergies}
                onChange={(e) =>
                  setFormData({ ...formData, allergies: e.target.value })
                }
                className="h-16 rounded-2xl text-xl font-black italic placeholder:text-red-400"
              />
            </div>
          </div>

          <div className="mt-16">
            <Button className="w-full h-20 rounded-[32px] font-black italic uppercase text-xl shadow-2xl relative overflow-hidden group">
              <span className="relative z-10">Mettre à jour le profil</span>
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-white/20 skew-x-12"
              />
            </Button>
          </div>
        </Card>

        <div className="space-y-10">
          <Card className="p-10 bg-primary text-white border-none shadow-3xl rounded-[48px] relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
              <Trophy size={200} />
            </div>
            <h4 className="text-[11px] font-black uppercase tracking-widest opacity-80 mb-2">
              Points Fidélité
            </h4>
            <div className="text-5xl font-black mb-8 italic tracking-tightest">
              1,450 PTS
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full mb-10 ring-4 ring-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "70%" }}
                className="h-full bg-white rounded-full shadow-glow shadow-white/50"
              />
            </div>
            <Button className="w-full bg-white text-primary hover:bg-slate-100 border-none font-black h-16 rounded-2xl italic uppercase text-xs tracking-widest shadow-xl">
              Marketplace Récompenses
            </Button>
          </Card>

          <Card className="p-10 border-none shadow-large rounded-[40px]">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-ink-secondary mb-8">
              Sécurité Pilot
            </h4>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-16 rounded-2xl font-black italic uppercase text-xs tracking-widest border-2 hover:bg-slate-50"
              >
                Code Sécurité QR
              </Button>
              <Button
                variant="ghost"
                className="w-full h-16 rounded-2xl font-black italic uppercase text-xs tracking-widest text-red-500 hover:bg-red-50"
                onClick={() => AuthService.logout()}
              >
                Déconnexion
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
