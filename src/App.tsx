import { useEffect, type ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  BarChart3,
  Utensils,
  User,
  ShieldCheck,
  ChefHat,
  Package,
  Sparkles,
  Leaf,
  LayoutGrid,
  Bell,
  Trophy,
  MessageSquare,
  ShoppingBag,
  LogOut,
  Clock,
  Sun,
  Moon,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// Modules
import StudentApp from "@/modules/StudentApp";
import KitchenApp from "@/modules/KitchenApp";
import AdminDashboard from "@/modules/AdminDashboard";
import Kiosk from "@/modules/Kiosk";
import Landing from "@/components/Landing";

// Store & Services
import { AuthService } from "@/services/auth";
import { DemoSimulation } from "@/services/simulation";
import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/types";

// UI Components
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const roleModules = {
  ADMIN: [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
    { id: "flux", label: "Flux du restaurant", icon: LayoutGrid, path: "/admin/flux" },
    { id: "ai", label: "Pilot IA", icon: Sparkles, path: "/admin/ai" },
    { id: "menu", label: "Menu", icon: Utensils, path: "/admin/menu" },
    { id: "stock", label: "Stocks", icon: Package, path: "/admin/stock" },
    { id: "profile", label: "Profil Admin", icon: User, path: "/admin/profile" },
  ],
  COOK: [
    { id: "kitchen", label: "Production", icon: ChefHat, path: "/kitchen/ops" },
    {
      id: "menu",
      label: "Menu du Jour",
      icon: Utensils,
      path: "/kitchen/menu",
    },
    {
      id: "orders",
      label: "Commandes",
      icon: ShoppingBag,
      path: "/kitchen/orders",
    },
    {
      id: "stock",
      label: "Alertes Stocks",
      icon: Package,
      path: "/kitchen/stock",
    },
    {
      id: "notifications",
      label: "Alertes Live",
      icon: Bell,
      path: "/kitchen/notifications",
    },
    { id: "auth", label: "Mon Profil", icon: User, path: "/kitchen/profile" },
  ],
  STUDENT: [
    {
      id: "menu",
      label: "Passer Commande",
      icon: ShoppingBag,
      path: "/student/order",
    },
    {
      id: "affluence",
      label: "Affluence",
      icon: LayoutGrid,
      path: "/student/affluence",
    },
    {
      id: "history",
      label: "Historique",
      icon: Clock,
      path: "/student/history",
    },
    {
      id: "fidelity",
      label: "Points Cadeaux",
      icon: Trophy,
      path: "/student/fidelity",
    },
    { id: "ai", label: "Nutrition IA", icon: Sparkles, path: "/student/ai" },
    { id: "auth", label: "Mon Profil", icon: User, path: "/student/profile" },
  ],
  CLIENT: [
    {
      id: "menu",
      label: "Commander",
      icon: ShoppingBag,
      path: "/student/order",
    },
    {
      id: "history",
      label: "Historique",
      icon: Clock,
      path: "/student/history",
    },
    { id: "auth", label: "Mon Profil", icon: User, path: "/student/profile" },
  ],
};

function AppLayout({ children }: { children: ReactNode }) {
  const { user, profile, isDemoMode } = useAuthStore();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 bg-background text-ink">
      <Toaster position="top-center" richColors closeButton />

      {!isLanding && (
        <header className="fixed top-0 left-0 right-0 z-50 glass h-20 px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-ink leading-none">
                FoodPilot
              </h1>
              <p className="text-sm font-bold text-primary uppercase tracking-wider mt-0.5">
                ESMT Innovate
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {isDemoMode && (
              <Badge variant="warning" className="hidden md:flex animate-pulse">
                Mode Démo
              </Badge>
            )}

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-sm font-bold text-ink uppercase tracking-tight">
                    {profile?.displayName || user.displayName}
                  </p>
                  <p className="text-xs font-bold text-ink-secondary uppercase tracking-tight">
                    {profile?.role || "STUDENT"}
                  </p>
                </div>
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-soft border-2 border-surface ring-1 ring-gray-100 group-hover:ring-primary transition-all">
                    <img
                      src={
                        user.photoURL ||
                        `https://picsum.photos/seed/${user.uid}/100/100`
                      }
                      alt="User"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-primary border-2 border-white rounded-full group-hover:scale-125 transition-transform" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => AuthService.logout()}
                  className="text-gray-400 hover:text-red-500"
                >
                  <LogOut size={20} />
                </Button>
              </div>
            ) : (
              <Link to="/">
                <Button variant="primary" size="sm">
                  Connexion
                </Button>
              </Link>
            )}
          </div>
        </header>
      )}

      <div className={cn("flex flex-1", !isLanding && "pt-20")}>
        {!isLanding && profile?.role && <Sidebar role={profile.role} />}

        <main
          className={cn(
            "flex-1 transition-all duration-500 w-full",
            !isLanding && "max-w-7xl mx-auto p-4 md:p-8",
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {!isLanding && profile?.role && <MobileNav role={profile.role} />}
    </div>
  );
}

function Sidebar({ role }: { role: UserRole }) {
  const location = useLocation();
  const modules = roleModules[role] || [];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-80px)] sticky top-20 border-r border-gray-100 dark:border-slate-800 p-6 overflow-y-auto custom-scrollbar">
      <div className="space-y-3">
        <p className="text-sm font-bold text-ink-secondary uppercase tracking-widest mb-6 ml-4">
          Pilotage
        </p>
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-base",
            location.pathname === "/"
              ? "bg-gray-100 text-ink"
              : "text-ink-secondary hover:text-ink hover:bg-gray-50 dark:hover:bg-slate-800/50",
          )}
        >
          <Home size={22} />
          <span>Accueil</span>
        </Link>
        {modules.map((m) => {
          const isActive = location.pathname.startsWith(m.path);
          const Icon = m.icon;
          return (
            <Link
              key={m.id}
              to={m.path}
              className={cn(
                "group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-base",
                isActive
                  ? "bg-primary text-white shadow-medium shadow-primary/20 scale-[1.02]"
                  : "text-ink-secondary hover:text-ink hover:bg-gray-50 dark:hover:bg-slate-800/50",
              )}
            >
              <Icon size={22} className={cn(isActive && "animate-pulse")} />
              <span>{m.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-sm"
                />
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

function MobileNav({ role }: { role: UserRole }) {
  const location = useLocation();
  const modules = roleModules[role]?.slice(0, 4) || [];

  return (
    <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50 glass shadow-large rounded-[32px] px-4 py-3 flex items-center justify-around">
      <Link
        to="/"
        className={cn(
          "p-3 rounded-2xl transition-all",
          location.pathname === "/"
            ? "bg-primary text-white scale-110 shadow-soft"
            : "text-ink-secondary",
        )}
      >
        <Home size={24} />
      </Link>
      {modules.map((m) => {
        const isActive = location.pathname.startsWith(m.path);
        const Icon = m.icon;
        return (
          <Link
            key={m.id}
            to={m.path}
            className={cn(
              "p-3 rounded-2xl transition-all relative",
              isActive
                ? "bg-primary text-white scale-110 shadow-soft"
                : "text-ink-secondary hover:text-ink",
            )}
          >
            <Icon size={24} />
          </Link>
        );
      })}
    </nav>
  );
}

function RoleGate({
  children,
  allowedRoles,
  currentRole,
}: {
  children: ReactNode;
  allowedRoles: UserRole[];
  currentRole: UserRole | null;
}) {
  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface p-12 rounded-[40px] shadow-large text-center max-w-sm border border-red-50 dark:border-red-500/10"
        >
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-soft">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold text-ink mb-4 tracking-tight">
            Accès Défié
          </h2>
          <p className="text-ink-secondary font-medium text-base leading-relaxed mb-8">
            Le code d'accès de votre rôle actuel (
            {currentRole || "NON IDENTIFIÉ"}) n'est pas autorisé ici.
          </p>
          <Link to="/">
            <Button variant="primary" className="w-full">
              Vers la Zone Sûre
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }
  return <>{children}</>;
}

export default function App() {
  const { loading, isDemoMode, profile } = useAuthStore();

  useEffect(() => {
    const unsubAuth = AuthService.init();
    if (isDemoMode) DemoSimulation.start();
    else DemoSimulation.stop();
    return () => {
      if (unsubAuth) unsubAuth();
      DemoSimulation.stop();
    };
  }, [isDemoMode]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 animate-pulse border-2 border-primary/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles
                size={32}
                className="text-primary animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight text-ink">
              FoodPilot
            </p>
            <p className="text-sm font-bold text-primary uppercase tracking-[0.3em] animate-pulse">
              Initialisation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/student/*"
            element={
              <RoleGate
                currentRole={profile?.role || null}
                allowedRoles={["STUDENT", "CLIENT", "ADMIN"]}
              >
                <StudentApp />
              </RoleGate>
            }
          />
          <Route
            path="/kitchen/*"
            element={
              <RoleGate
                currentRole={profile?.role || null}
                allowedRoles={["COOK", "ADMIN"]}
              >
                <KitchenApp />
              </RoleGate>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RoleGate
                currentRole={profile?.role || null}
                allowedRoles={["ADMIN"]}
              >
                <AdminDashboard />
              </RoleGate>
            }
          />
          <Route path="/kiosk" element={<Kiosk />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
