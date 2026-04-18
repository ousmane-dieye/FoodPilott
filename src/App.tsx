import { useState, useEffect, type ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Utensils, 
  User, 
  Tablet, 
  Coffee,
  Menu as MenuIcon,
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
  Calendar
} from "lucide-react";
import { cn } from "./lib/utils";

// Modules (we'll define these in separate files soon)
import StudentApp from "./modules/StudentApp";
import KitchenApp from "./modules/KitchenApp";
import AdminDashboard from "./modules/AdminDashboard";
import Kiosk from "./modules/Kiosk";

// Navigation logic handled dynamically below

export type UserRole = 'ADMIN' | 'COOK' | 'STUDENT';

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
    { id: 'reservations', label: 'Réservations', icon: ShieldCheck, path: '/student/reservations' },
    { id: 'stats', label: 'Ma Fidélité', icon: Trophy, path: '/student/fidelity' },
    { id: 'ai', label: 'Nutrition IA', icon: Sparkles, path: '/student/ai' },
    { id: 'antigaspillage', label: 'Bons Plans', icon: Leaf, path: '/student/antigaspi' },
    { id: 'tables', label: 'Places Libres', icon: LayoutGrid, path: '/student/tables' },
    { id: 'feedback', label: 'Avis', icon: MessageSquare, path: '/student/feedback' },
    { id: 'auth', label: 'Mon Profil', icon: User, path: '/student/profile' },
  ]
};

function Sidebar({ role }: { role: UserRole | null }) {
  const location = useLocation();
  if (!role || location.pathname === '/') return null;

  const modules = roleModules[role] || [];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 p-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
      <div className="space-y-1">
        {modules.map((m) => {
          const isActive = location.pathname === m.path;
          return (
            <Link
              key={m.id}
              to={m.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                isActive ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              )}
            >
              <m.icon size={20} />
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
  // For mobile, we might only show a subset of main modules to avoid clutter
  const mainModules = modules.slice(0, 5);

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] px-4 py-3 flex items-center justify-between z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link to="/" className="p-2 text-gray-400">
         <ShieldCheck size={20} />
      </Link>
      {mainModules.map((m) => {
        const isActive = location.pathname === m.path;
        return (
          <Link
            key={m.id}
            to={m.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              isActive ? "text-primary scale-110" : "text-gray-400"
            )}
          >
            <m.icon size={20} />
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
           <h2 className="text-2xl font-black text-red-600 mb-2 tracking-tighter uppercase">Route Invisible</h2>
           <p className="text-gray-400 font-medium text-sm">
             Cette interface n'existe pas pour votre profil actuel.
           </p>
           <Link to="/" className="mt-8 inline-block bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm">Retour</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function Landing({ onRoleSelect }: { onRoleSelect: (role: UserRole) => void }) {
  const cards = [
    {
      id: 'STUDENT',
      to: '/student/order',
      title: 'Application Étudiant',
      description: 'Commander vos repas, gérer votre fidélité et consulter l\'IA nutrition.',
      icon: User,
      color: 'bg-primary',
    },
    {
      id: 'COOK',
      to: '/kitchen/ops',
      title: 'Dashboard Cuisine',
      description: 'Pilotage complet de la production et fiches techniques IA.',
      icon: ChefHat,
      color: 'bg-orange-500',
    },
    {
      id: 'ADMIN',
      to: '/admin/stats',
      title: 'Dashboard Admin',
      description: 'Gestion totale : Stocks, Menus, Stats et Anti-Gaspillage.',
      icon: BarChart3,
      color: 'bg-blue-600',
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em]">Demo Prototypage</h2>
        <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-4">
          FoodPilot <br/> 
          <span className="text-gray-300">Hackathon</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
          Navigation dynamique activée : Sélectionnez un rôle pour générer l'interface dédiée.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => (
          <Link 
            key={card.id}
            to={card.to}
            onClick={() => onRoleSelect(card.id as UserRole)}
            className="group relative bg-white p-10 rounded-[48px] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
          >
            <div className={cn(
              "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity",
              card.color
            )} />

            <div className={cn(
              "w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg transition-transform group-hover:rotate-6",
              card.color
            )}>
              <card.icon size={32} />
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{card.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium">
              {card.description}
            </p>

            <div className="flex items-center gap-2 text-xs font-black group-hover:gap-4 transition-all uppercase tracking-widest">
              <span className={cn(card.color.replace('bg-', 'text-'))}>Générer l'interface</span>
              <ChevronRight size={14} className={cn(card.color.replace('bg-', 'text-'))} />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-center gap-6 text-center">
        <div className="flex gap-2">
            {['No Login Bottleneck', 'Dynamic Routes', 'RBAC Middleware'].map(tag => (
                <span key={tag} className="px-4 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black text-gray-400 shadow-sm uppercase tracking-tighter">{tag}</span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<UserRole | null>(localStorage.getItem('demo_role') as UserRole);

  const handleRoleChange = (newRole: UserRole) => {
    localStorage.setItem('demo_role', newRole);
    setRole(newRole);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-50 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:rotate-12">F</div>
            <h1 className="text-xl font-extrabold tracking-tight text-primary">FoodPilot</h1>
          </Link>
          <div className="flex items-center gap-4">
             {role && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Profil: {role}
                </div>
             )}
             <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
               <ShieldCheck size={12} />
               <span>RBAC Actif</span>
             </div>
          </div>
        </header>

        <div className="flex flex-1">
          <Sidebar role={role} />
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Landing onRoleSelect={handleRoleChange} />} />
              <Route path="/student/*" element={
                <RoleGate currentRole={role} allowedRoles={['STUDENT']}>
                  <StudentApp />
                </RoleGate>
              } />
              <Route path="/kitchen/*" element={
                <RoleGate currentRole={role} allowedRoles={['COOK', 'ADMIN']}>
                  <KitchenApp />
                </RoleGate>
              } />
              <Route path="/admin/*" element={
                <RoleGate currentRole={role} allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleGate>
              } />
              <Route path="/kiosk" element={<Kiosk />} />
            </Routes>
          </main>
        </div>

        <Navigation role={role} />
      </div>
    </Router>
  );
}
