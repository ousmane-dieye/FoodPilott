import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Utensils, 
  User, 
  BarChart3, 
  Tablet, 
  Coffee,
  Menu as MenuIcon
} from "lucide-react";
import { cn } from "./lib/utils";

// Modules (we'll define these in separate files soon)
import StudentApp from "./modules/StudentApp";
import KitchenApp from "./modules/KitchenApp";
import AdminDashboard from "./modules/AdminDashboard";
import Kiosk from "./modules/Kiosk";

function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/", icon: User, label: "Étudiant", color: "text-primary" },
    { to: "/kitchen", icon: Utensils, label: "Cuisine", color: "text-orange-500" },
    { to: "/admin", icon: BarChart3, label: "Admin", color: "text-blue-600" },
    { to: "/kiosk", icon: Tablet, label: "Kiosque", color: "text-purple-600" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-6 py-3 flex items-center gap-8 z-50">
      {links.map((link) => {
        const isActive = location.pathname === link.to;
        const Icon = link.icon;
        return (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? cn(link.color, "scale-110 font-bold") : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] uppercase tracking-wider">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
        <header className="bg-white border-bottom border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
            <h1 className="text-xl font-extrabold tracking-tight text-primary">FoodPilot</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 text-primary rounded-full text-xs font-medium">
               <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
               Système Intelligent Actif
             </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<StudentApp />} />
            <Route path="/kitchen" element={<KitchenApp />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/kiosk" element={<Kiosk />} />
          </Routes>
        </main>

        <Navigation />
      </div>
    </Router>
  );
}
