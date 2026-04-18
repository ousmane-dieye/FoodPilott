import { useEffect, type ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Utensils, 
  User, 
  ShieldCheck, 
  ChevronRight, 
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
  Clock
} from "lucide-react";
import { cn } from "./lib/utils";
import { Toaster, toast } from 'sonner';

// Modules
import StudentApp from "./modules/StudentApp";
import KitchenApp from "./modules/KitchenApp";
import AdminDashboard from "./modules/AdminDashboard";
import Kiosk from "./modules/Kiosk";
import Landing from "./components/Landing";

// Services & Store
import { AuthService } from "./services/auth";
import { DemoSimulation } from "./services/simulation";
import { useAuthStore } from "./store/useAuthStore";
import { UserRole } from "./types";

const roleModules = {
  ADMIN: [
    { id: 'stats', label: 'Dashboard', icon: BarChart3, path: '/admin/stats' },
    { id: 'menu', label: 'Menu & Plats', icon: Utensils, path: '/admin/menu' },
    { id: 'reservations', label: 'Réservations', icon: ShieldCheck, path: '/admin/reservations' },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag, path: '/admin/orders' },
    { id: 'kitchen', label: 'Cuisine', icon: ChefHat, path: '/admin/kitchen' },
    { id: 'stock', label: 'Stocks', icon: Package, path: '/admin/stock' },
    { id: 'ai', label: 'FoodPilot IA', icon: Sparkles, path: '/admin/ai' },
    { id: 'antigaspillage', label: 'Anti-Gaspillage', icon: Leaf, path: '/admin/antigaspi' },
    { id: 'tables', label: 'Tables', icon: LayoutGrid, path: '/admin/tables' },
    { id: 'fidelity', label: 'Fidélité', icon: Trophy, path: '/admin/fidelity' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/admin/feedback' },
    { id: 'auth', label: 'Mon Profil', icon: User, path: '/admin/profile' },
  ],
  COOK: [
    { id: 'kitchen', label: 'Cuisine Ops', icon: ChefHat, path: '/kitchen/ops' },
    { id: 'menu', label: 'Menu du Jour', icon: Utensils, path: '/kitchen/menu' },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag, path: '/kitchen/orders' },
    { id: 'ai', label: 'IA Recettes', icon: Sparkles, path: '/kitchen/ai' },
    { id: 'stock', label: 'Stock Alerte', icon: Package, path: '/kitchen/stock' },
    { id: 'notifications', label: 'Alertes', icon: Bell, path: '/kitchen/notifications' },
    { id: 'auth', label: 'Mon Profil', icon: User, path: '/kitchen/profile' },
  ],
  STUDENT: [
    { id: 'menu', label: 'Commander', icon: ShoppingBag, path: '/student/order' },
    { id: 'history', label: 'Mes Commandes', icon: Clock, path: '/student/history' },
    { id: 'reservations', label: 'Réservations', icon: ShieldCheck, path: '/student/reservations' },
    { id: 'stats', label: 'Ma Fidélité', icon: Trophy, path: '/student/fidelity' },
    { id: 'ai', label: 'Nutrition IA', icon: Sparkles, path: '/student/ai' },
    { id: 'antigaspillage', label: 'Bons Plans', icon: Leaf, path: '/student/antigaspi' },
    { id: 'tables', label: 'Places Libres', icon: LayoutGrid, path: '/student/tables' },
    { id: 'feedback', label: 'Avis', icon: MessageSquare, path: '/student/feedback' },
    { id: 'auth', label: 'Mon Profil', icon: User, path: '/student/profile' },
  ],
  CLIENT: [
    { id: 'menu', label: 'Commander', icon: ShoppingBag, path: '/student/order' },
    { id: 'history', label: 'Mes Commandes', icon: Clock, path: '/student/history' },
    { id: 'feedback', label: 'Avis', icon: MessageSquare, path: '/student/feedback' },
    { id: 'auth', label: 'Mon Profil', icon: User, path: '/student/profile' },
  ]
};

// ... Sidebar, Navigation, RoleGate unchanged (just using profile.role instead of local state) ...

function Sidebar({ role }: { role: UserRole | null }) {
  const location = useLocation();
  if (!role || location.pathname === '/') return null;

  const modules = roleModules[role] || [];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 p-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
      <div className="space-y-1">
        {modules.map((m) => {
          const isActive = location.pathname.startsWith(m.path);
          const Icon = m.icon;
          return (
            <Link
              key={m.id}
              to={m.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                isActive ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              )}
            >
              <Icon size={20} />
              <span>{m.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

function Navigation({ role }: { role: UserRole | null }) {
  const location = useLocation();
  if (!role || location.pathname === '/') return null;

  const modules = roleModules[role] || [];
  const mainModules = modules.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] px-4 py-3 flex items-center justify-between z-50">
      <Link to="/" className="p-2 text-gray-400">
         <ShieldCheck size={20} />
      </Link>
      {mainModules.map((m) => {
        const isActive = location.pathname.startsWith(m.path);
        const Icon = m.icon;
        return (
          <Link
            key={m.id}
            to={m.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              isActive ? "text-primary scale-110" : "text-gray-400"
            )}
          >
            <Icon size={20} />
          </Link>
        );
      })}
    </nav>
  );
}

function RoleGate({ children, allowedRoles, currentRole }: { children: ReactNode, allowedRoles: UserRole[], currentRole: UserRole | null }) {
  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="bg-white p-12 rounded-[48px] border border-red-50 shadow-2xl text-center max-w-sm">
           <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} />
           </div>
           <h2 className="text-2xl font-black text-red-600 mb-2 tracking-tighter uppercase">Accès restreint</h2>
           <p className="text-gray-400 font-medium text-sm">
             Votre profil ne possède pas les permissions nécessaires pour accéder à ce module.
           </p>
           <Link to="/" className="mt-8 inline-block bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm">Retour</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  const { user, profile, loading, isDemoMode } = useAuthStore();

  useEffect(() => {
    AuthService.init();
    
    if (isDemoMode) {
      DemoSimulation.start();
    } else {
      DemoSimulation.stop();
    }

    return () => DemoSimulation.stop();
  }, [isDemoMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">FoodPilot Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm font-sans">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:rotate-12">F</div>
            <h1 className="text-xl font-extrabold tracking-tight text-primary">FoodPilot</h1>
          </Link>
          
          <div className="flex items-center gap-6">
            {isDemoMode && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Sparkles size={12} />
                Mode Démo
              </div>
            )}
            {user ? (
               <div className="flex items-center gap-4">
                  <div className="hidden md:flex flex-col items-end">
                     <span className="text-xs font-black text-gray-900 uppercase">{profile?.displayName || user.displayName}</span>
                     <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{profile?.role || 'STUDENT'}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border-2 border-white ring-1 ring-gray-100">
                     <img src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt="Avatar" referrerPolicy="no-referrer" />
                  </div>
                  <button 
                    onClick={() => AuthService.logout()}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
               </div>
            ) : (
               <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Non connecté
               </div>
            )}
          </div>
        </header>

        <div className="flex flex-1">
          <Sidebar role={profile?.role || null} />
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/student/*" element={
                <RoleGate currentRole={profile?.role || null} allowedRoles={['STUDENT', 'CLIENT', 'ADMIN']}>
                  <StudentApp />
                </RoleGate>
              } />
              <Route path="/kitchen/*" element={
                <RoleGate currentRole={profile?.role || null} allowedRoles={['COOK', 'ADMIN']}>
                  <KitchenApp />
                </RoleGate>
              } />
              <Route path="/admin/*" element={
                <RoleGate currentRole={profile?.role || null} allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleGate>
              } />
              <Route path="/kiosk" element={<Kiosk />} />
            </Routes>
          </main>
        </div>

        <Navigation role={profile?.role || null} />
      </div>
    </Router>
  );
}
