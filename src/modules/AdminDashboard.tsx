import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
  Star,
  Sparkles,
  ArrowUpRight,
  Download,
  Calendar,
  Filter,
  Package,
  MoreVertical,
  ChevronLeft,
  Plus,
  Utensils,
  ShieldCheck,
  ChefHat,
  Leaf,
  Trophy,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";

// UI Components
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="stats" element={<StatsView />} />
      <Route path="menu" element={<AdminTopDishesView />} />
      <Route
        path="reservations"
        element={
          <PlaceholderView
            title="Flux du Restaurant"
            icon={<ShieldCheck size={40} />}
          />
        }
      />
      <Route path="orders" element={<AdminOrdersView />} />
      <Route path="kitchen" element={<AdminKitchenView />} />
      <Route path="stock" element={<InventoryView />} />
      <Route path="inventory" element={<InventoryView />} />
      <Route
        path="ai"
        element={
          <PlaceholderView
            title="Pilotage IA Vision"
            icon={<Sparkles size={40} />}
          />
        }
      />
      <Route path="antigaspi" element={<AdminGaspiView />} />
      <Route
        path="fidelity"
        element={
          <PlaceholderView
            title="Loyalty Program"
            icon={<Trophy size={40} />}
          />
        }
      />
      <Route
        path="profile"
        element={
          <PlaceholderView title="Mon Profil Admin" icon={<User size={40} />} />
        }
      />
      <Route path="*" element={<StatsView />} />
    </Routes>
  );
}

function PlaceholderView({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8">
      <div className="w-24 h-24 bg-surface rounded-[32px] flex items-center justify-center text-primary shadow-large animate-float">
        {icon}
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black tracking-tightest text-ink italic">
          {title}
        </h2>
        <p className="text-ink-secondary font-medium">
          Ce module est en cours de déploiement sur votre terminal FoodPilot.
        </p>
      </div>
      <Link to="/admin/stats">
        <Button
          variant="secondary"
          className="px-8 h-14 rounded-2xl font-black italic"
        >
          RETOUR AU DASHBOARD
        </Button>
      </Link>
    </div>
  );
}

const data = [
  { name: "Lun", sales: 4200, orders: 150 },
  { name: "Mar", sales: 3800, orders: 120 },
  { name: "Mer", sales: 5100, orders: 180 },
  { name: "Jeu", sales: 4900, orders: 165 },
  { name: "Ven", sales: 6200, orders: 210 },
  { name: "Sam", sales: 2400, orders: 80 },
  { name: "Dim", sales: 1800, orders: 60 },
];

function StatsView() {
  const handleExport = (type: "csv" | "pdf") => {
    toast.success(`Export ${type.toUpperCase()} généré avec succès`);
  };

  return (
    <div className="space-y-12">
      {/* Header with actions */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tightest text-ink italic uppercase">
            Dashboard
          </h2>
          <p className="text-base font-bold text-ink-secondary uppercase tracking-widest mt-1">
            Suivi des performances • Global Network Pilot
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="hidden sm:flex h-12 px-6 rounded-xl font-bold bg-white border-2 border-gray-100"
            icon={<Calendar size={18} className="mr-2" />}
          >
            7 Derniers Jours
          </Button>
          <Link to="/admin/inventory">
            <Button
              variant="secondary"
              size="sm"
              className="h-12 px-6 rounded-xl font-bold bg-white border-2 border-gray-100"
              icon={<Package size={18} className="mr-2" />}
            >
              Stocks
            </Button>
          </Link>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            t: "Revenu Total",
            v: "1,452,000 F",
            d: "+12.5%",
            tr: "up",
            icon: DollarSign,
            c: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
          },
          {
            t: "Commandes",
            v: "976",
            d: "+5.2%",
            tr: "up",
            icon: ShoppingBag,
            c: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-500/10",
          },
          {
            t: "Nouveaux Visiteurs",
            v: "142",
            d: "-2.1%",
            tr: "down",
            icon: Users,
            c: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-500/10",
          },
          {
            t: "Satisfaction",
            v: "4.9/5",
            d: "+0.2%",
            tr: "up",
            icon: Star,
            c: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-500/10",
          },
        ].map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hoverable p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-4 rounded-2xl shadow-soft", k.bg, k.c)}>
                  <k.icon size={24} />
                </div>
                <Badge variant={k.tr === "up" ? "success" : "danger"}>
                  {k.tr === "up" ? (
                    <TrendingUp size={10} className="mr-1" />
                  ) : (
                    <TrendingDown size={10} className="mr-1" />
                  )}
                  {k.d}
                </Badge>
              </div>
              <div>
                <p className="text-4xl font-bold tracking-tight text-ink mb-1">
                  {k.v}
                </p>
                <p className="text-sm font-bold text-ink-secondary uppercase tracking-wider">
                  {k.t}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 h-[450px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-2xl text-ink tracking-tight">
                Performance des Ventes
              </h3>
              <p className="text-base font-medium text-ink-secondary">
                Volume des ventes journalier
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-gray-300">
              <MoreVertical size={20} />
            </div>
          </div>
          <div className="h-full pb-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                  className="dark:stroke-slate-800"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "var(--shadow-medium)",
                    fontWeight: 800,
                    fontSize: "12px",
                  }}
                  cursor={{ stroke: "#00A86B", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-primary)"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 h-[450px]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-2xl text-ink tracking-tight">
                Flux Commandes
              </h3>
              <p className="text-base font-medium text-ink-secondary">
                Répartition par jour
              </p>
            </div>
          </div>
          <div className="h-full pb-16">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                  className="dark:stroke-slate-800"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "var(--shadow-medium)",
                    fontWeight: 800,
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                />
                <Bar
                  dataKey="orders"
                  fill="var(--color-primary-dark)"
                  radius={[8, 8, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Bottom section: Recent Orders & Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-0 overflow-hidden">
          <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ventes Récentes</CardTitle>
              <CardDescription>Transactions en temps réel</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary pr-0">
              Voir tout <ArrowUpRight className="ml-1" size={14} />
            </Button>
          </CardHeader>
          <div className="mt-6">
            {[
              {
                id: "4581",
                u: "Ousmane D.",
                p: "Thieboudienne",
                v: "+2,500 F",
                t: "Il y a 3 min",
              },
              {
                id: "4580",
                u: "Fatou K.",
                p: "Burger Pilot",
                v: "+3,500 F",
                t: "Il y a 8 min",
              },
              {
                id: "4579",
                u: "Moussa S.",
                p: "Yassa Poulet",
                v: "+2,800 F",
                t: "Il y a 12 min",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-6 border-t border-gray-50 dark:border-slate-800 hover:bg-background transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-base text-ink">{s.u}</p>
                    <p className="text-sm font-bold text-ink-secondary uppercase tracking-wide">
                      {s.p} — ID #{s.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-emerald-600 font-mono tracking-tight">
                    {s.v}
                  </p>
                  <p className="text-sm font-bold text-ink-secondary uppercase tracking-wide">
                    {s.t}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 bg-indigo-600 dark:bg-indigo-900 text-white border-none shadow-large relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
            <Sparkles size={160} />
          </div>
          <div className="relative">
            <h3 className="text-3xl font-bold mb-4">FoodPilot Vision IA</h3>
            <p className="text-indigo-100 text-lg font-medium mb-8 max-w-sm">
              Nos algorithmes prédisent une hausse de 15% de la demande pour
              demain midi. Prévoyez 10 kg de riz supplémentaire.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-sm font-bold uppercase tracking-wider opacity-80 mb-2">
                <span>Précision Vision</span>
                <span>94%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden ring-1 ring-white/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  className="h-full bg-white shadow-soft"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 flex-1 py-4 font-black">
                Appliquer Pilotage
              </Button>
              <Button
                variant="ghost"
                className="bg-white/10 text-white hover:bg-white/20 px-8 border-none"
              >
                Détails
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function InventoryView() {
  const [ingredients] = useState([
    { name: "Riz Parfumé", stock: 45, unit: "kg", threshold: 10, status: "ok" },
    {
      name: "Oignons",
      stock: 12,
      unit: "kg",
      threshold: 15,
      status: "warning",
    },
    { name: "Huile", stock: 5, unit: "L", threshold: 10, status: "critical" },
    {
      name: "Pain Burger",
      stock: 200,
      unit: "unit",
      threshold: 50,
      status: "ok",
    },
    { name: "Poulet", stock: 8, unit: "kg", threshold: 10, status: "critical" },
  ]);

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/stats">
            <Button variant="ghost" size="icon" className="group">
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-ink">
              Gestion Stocks
            </h2>
            <p className="text-base font-medium text-ink-secondary">
              État des ingrédients en temps réel
            </p>
          </div>
        </div>
        <Button
          icon={<Plus size={20} className="mr-2" />}
          className="px-6 rounded-2xl"
        >
          Ajouter Ingrédient
        </Button>
      </header>

      <Card className="p-0 overflow-hidden border-none shadow-medium">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="p-6 text-sm font-bold text-ink-secondary uppercase tracking-widest">
                  Ingrédient
                </th>
                <th className="p-6 text-sm font-bold text-ink-secondary uppercase tracking-widest">
                  Stock Actuel
                </th>
                <th className="p-6 text-sm font-bold text-ink-secondary uppercase tracking-widest">
                  Seuil Alerte
                </th>
                <th className="p-6 text-sm font-bold text-ink-secondary uppercase tracking-widest">
                  Statut
                </th>
                <th className="p-6 text-sm font-bold text-ink-secondary uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {ingredients.map((ing, i) => (
                <tr
                  key={i}
                  className="group hover:bg-background transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform shadow-sm">
                        <Package size={22} />
                      </div>
                      <span className="font-bold text-base text-ink">
                        {ing.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="font-mono font-bold text-base text-ink">
                      {ing.stock} {ing.unit}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="font-mono font-bold text-base text-ink-secondary">
                      {ing.threshold} {ing.unit}
                    </span>
                  </td>
                  <td className="p-6">
                    <Badge
                      variant={
                        ing.status === "ok"
                          ? "success"
                          : ing.status === "warning"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {ing.status === "ok"
                        ? "Sain"
                        : ing.status === "warning"
                          ? "Limité"
                          : "Critique"}
                    </Badge>
                  </td>
                  <td className="p-6">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-10 text-sm rounded-lg"
                    >
                      Commander
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function AdminTopDishesView() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tightest text-ink italic uppercase">
            Top des Plats
          </h2>
          <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest mt-1">
            Les mieux vendus & les mieux notés
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: "Thieboudienne Rouge",
            sales: 145,
            rating: 4.9,
            img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=2074&auto=format&fit=crop",
          },
          {
            name: "Dibi Agneau",
            sales: 120,
            rating: 4.9,
            img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
          },
          {
            name: "Yassa au Poulet",
            sales: 98,
            rating: 4.7,
            img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1913&auto=format&fit=crop",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="p-6 border-2 border-gray-100 hover:border-primary/30 transition-all flex flex-col gap-4"
          >
            <div className="h-40 rounded-2xl overflow-hidden bg-surface relative">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-xs font-black shadow-soft flex items-center gap-1">
                <Star size={14} className="text-amber-500 fill-amber-500" />{" "}
                {item.rating}
              </div>
            </div>
            <div>
              <h3 className="font-black text-xl italic uppercase text-ink leading-tight">
                {item.name}
              </h3>
              <p className="text-sm font-bold text-ink-secondary tracking-widest mt-1">
                {item.sales} VENTES
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminOrdersView() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tightest text-ink italic uppercase">
            Ventes de la journée
          </h2>
          <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest mt-1">
            Revenus et flux des commandes
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-primary/10 border-none">
          <h3 className="text-xl font-black italic uppercase text-primary">
            Revenu Total
          </h3>
          <p className="text-4xl font-black tracking-tightest text-ink mt-2">
            452,000 F
          </p>
        </Card>
        <Card className="p-6 bg-surface border-none">
          <h3 className="text-xl font-black italic uppercase text-ink">
            Commandes
          </h3>
          <p className="text-4xl font-black tracking-tightest text-ink mt-2">
            124
          </p>
        </Card>
        <Card className="p-6 bg-emerald-50 border-none">
          <h3 className="text-xl font-black italic uppercase text-emerald-500">
            Panier Moyen
          </h3>
          <p className="text-4xl font-black tracking-tightest text-ink mt-2">
            3,645 F
          </p>
        </Card>
      </div>
      <Card className="p-8 border-none bg-surface/50 mt-8">
        <div className="h-80 flex items-end justify-between gap-2">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="w-full bg-primary/20 rounded-t-lg relative group"
              style={{ height: `${Math.max(10, Math.random() * 100)}%` }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-ink text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {i}h
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdminKitchenView() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tightest text-ink italic uppercase">
            Supervision Cuisine
          </h2>
          <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest mt-1">
            Statut des plateaux et efficacité
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 border-2 border-emerald-100 bg-emerald-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black italic uppercase text-emerald-600">
              Temps Moyen (Préparation)
            </h3>
            <p className="text-sm font-bold text-emerald-600/70 uppercase">
              Cible: 12 min
            </p>
          </div>
          <p className="text-5xl font-black tracking-tightest text-emerald-600">
            14<span className="text-2xl">m</span>
          </p>
        </Card>
        <Card className="p-8 border-2 border-amber-100 bg-amber-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black italic uppercase text-amber-600">
              Commandes en retard
            </h3>
            <p className="text-sm font-bold text-amber-600/70 uppercase">
              &gt; 20 min d'attente
            </p>
          </div>
          <p className="text-5xl font-black tracking-tightest text-amber-600">
            3
          </p>
        </Card>
      </div>
    </div>
  );
}

function AdminGaspiView() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tightest text-ink italic uppercase">
            Anti-Gaspillage
          </h2>
          <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest mt-1">
            Optimisation des portions et restes
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 border-none bg-emerald-50">
          <Leaf size={32} className="text-emerald-500 mb-4" />
          <h3 className="text-3xl font-black italic text-emerald-600">
            12.5 kg
          </h3>
          <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest mt-1">
            Gaspillage évité ce mois
          </p>
        </Card>
        <Card className="p-8 border-none bg-primary/10">
          <TrendingDown size={32} className="text-primary mb-4" />
          <h3 className="text-3xl font-black italic text-primary">-15%</h3>
          <p className="text-xs font-bold text-primary/70 uppercase tracking-widest mt-1">
            Réduction vs mois dernier
          </p>
        </Card>
        <Card className="p-8 border-none bg-amber-50">
          <Package size={32} className="text-amber-500 mb-4" />
          <h3 className="text-3xl font-black italic text-amber-600">4 Plats</h3>
          <p className="text-xs font-bold text-amber-600/70 uppercase tracking-widest mt-1">
            Portions à réajuster
          </p>
        </Card>
      </div>
      <Card className="p-8 border-none bg-white shadow-soft">
        <h4 className="font-black italic uppercase text-ink mb-6">
          Recommandations IA
        </h4>
        <div className="space-y-4">
          <div className="p-4 bg-surface rounded-xl border border-gray-100 flex gap-4 items-start">
            <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="font-bold text-ink">
                Réduire les portions de riz sur le Thieboudienne de 5%
              </p>
              <p className="text-sm text-ink-secondary mt-1">
                Nos capteurs visuels ("Retour assiette") montrent régulièrement
                un surplus non consommé sur ce plat spécifique.
              </p>
            </div>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-gray-100 flex gap-4 items-start">
            <div className="p-2 bg-white rounded-lg shadow-sm text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="font-bold text-ink">
                Alerte péremption : Légumes frais
              </p>
              <p className="text-sm text-ink-secondary mt-1">
                Intégrer les tomates et poivrons du lot A24 dans "Salade
                Fraîcheur" avant demain midi pour éviter les pertes.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
