import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  ChefHat, 
  BarChart3, 
  Mail, 
  Lock, 
  ArrowRight, 
  Play,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/context/ThemeContext";

// UI Components
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export default function Landing() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [authView, setAuthView] = useState<'login' | 'register-student' | 'register-client' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  
  const [studentData, setStudentData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '', allergies: [] as string[], otherAllergies: ''
  });

  const [clientData, setClientData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', phone: ''
  });

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const allergyOptions = ['arachides', 'lactose', 'gluten', 'fruits de mer', 'œufs', 'soja'];

  const handleDemoMode = async (role: UserRole) => {
    try {
      await AuthService.loginAsDemo(role);
      toast.success(`Mode démo activé : ${role}`);
      redirectByRole(role);
    } catch (e) {
      toast.error("Échec de l'activation du mode démo");
    }
  };

  const redirectByRole = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': navigate('/admin/stats'); break;
      case 'COOK': navigate('/kitchen/ops'); break;
      case 'STUDENT': navigate('/student/order'); break;
      case 'CLIENT': navigate('/student/order'); break;
      default: navigate('/');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authView === 'login') {
        const profile = await AuthService.loginWithEmail(loginData.email, loginData.password);
        if (profile) {
          toast.success("Bon retour sur FoodPilot !");
          redirectByRole(profile.role);
        }
      } else if (authView === 'register-student') {
        if (studentData.password !== studentData.confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas");
        }
        await AuthService.registerStudent({
          email: studentData.email,
          pass: studentData.password,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          phone: studentData.phone,
          allergies: studentData.allergies,
          otherAllergies: studentData.otherAllergies
        });
        toast.success("Compte étudiant créé !");
        navigate('/student/order');
      } else if (authView === 'register-client') {
        if (clientData.password !== clientData.confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas");
        }
        await AuthService.registerClient({
          email: clientData.email,
          pass: clientData.password,
          fullName: clientData.fullName,
          phone: clientData.phone
        });
        toast.success("Bienvenue chez FoodPilot !");
        navigate('/student/order');
      } else {
        await AuthService.resetPassword(loginData.email);
        toast.success("Lien de réinitialisation envoyé !");
        setAuthView('login');
      }
    } catch (error: any) {
      if (error.message && !error.code) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const demoCards = [
    { role: 'STUDENT' as UserRole, title: 'Étudiant', desc: 'Commander, Fidélité, IA Nutrition', icon: User, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { role: 'COOK' as UserRole, title: 'Cuisinier', desc: 'Gestion Kitchen, Commandes, IA Recettes', icon: ChefHat, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { role: 'ADMIN' as UserRole, title: 'Admin', desc: 'Analytics, Stocks, Pilotage Global', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' }
  ];

  if (user) {
    // If logged in, show a simple welcome back screen instead of the landing
    return (
       <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <Card className="max-w-md w-full text-center p-12">
             <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary shadow-soft">
                <Sparkles size={40} />
             </div>
             <h2 className="text-3xl font-black tracking-tighter text-ink mb-2">Bienvenue</h2>
             <p className="text-gray-400 font-medium mb-8">Voulez-vous retourner à votre interface de pilotage ?</p>
             <div className="space-y-3">
                <Button onClick={() => redirectByRole(useAuthStore.getState().profile?.role || 'STUDENT')} className="w-full">
                  Accéder au Pilotage
                </Button>
                <Button variant="ghost" onClick={() => AuthService.logout()} className="w-full">
                  Déconnexion
                </Button>
             </div>
          </Card>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center py-20 px-6">
      {/* Background blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <header className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft transition-transform group-hover:rotate-12">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-ink">FoodPilot</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
           {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        <motion.div
           initial={{ opacity: 0, x: -60 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider border border-primary/20">
            <Sparkles size={16} /> Innovation ESMT 2026
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-ink tracking-tightest leading-[0.85] uppercase italic">
            The New Era <br/>
            <span className="text-primary not-italic">of Dining.</span>
          </h1>
          
          <p className="text-2xl text-ink-secondary font-bold max-w-lg leading-relaxed opacity-100 italic">
            FoodPilot redéfinit l'expérience culinaire universitaire à l'ESMT. Une plateforme intelligente pour les étudiants, les cuisiniers et les gestionnaires.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             {demoCards.map((card, i) => (
                <motion.button
                  key={card.role}
                  whileHover={{ y: -5, shadow: "var(--shadow-medium)" }}
                  onClick={() => handleDemoMode(card.role)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-[32px] border border-gray-100 dark:border-slate-800 bg-surface/50 backdrop-blur-md text-center transition-all",
                    "hover:border-primary/30"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft", card.bg, card.color)}>
                     <card.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-ink">{card.title}</h3>
                    <p className="text-sm font-bold text-ink-secondary uppercase tracking-wide">Mode Démo</p>
                  </div>
                </motion.button>
             ))}
          </div>

          <div className="flex items-center gap-6 pt-6">
             <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-background bg-gray-200 overflow-hidden ring-1 ring-primary/20">
                     <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" />
                  </div>
                ))}
             </div>
             <p className="text-sm font-bold text-ink">
               <span className="text-primary">+500 étudiants</span> déjà connectés au pilotage.
             </p>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 60 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <Card className="p-10 md:p-12 border-none shadow-large bg-surface/80 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 text-gray-100 pointer-events-none group-hover:rotate-12 group-hover:scale-110 transition-transform">
               <ShieldCheck size={200} />
            </div>

            <div className="relative">
               <div className="mb-12">
                 <h2 className="text-4xl font-bold text-ink tracking-tight">Authentification</h2>
                 <p className="text-base text-ink-secondary font-medium mt-2">Connectez-vous à la Zone FoodPilot Network</p>
               </div>

               <AnimatePresence mode="wait">
                 <motion.form 
                   key={authView}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   onSubmit={handleAuth} 
                   className="space-y-5"
                 >
                   {authView === 'login' || authView === 'forgot' ? (
                     <>
                        <Input 
                          label="E-mail"
                          type="email"
                          required
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          placeholder="votre.email@esmt.sn"
                          icon={<Mail size={18} />}
                        />
                        {authView === 'login' && (
                          <Input 
                            label="Mot de passe"
                            type="password"
                            required
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            placeholder="••••••••"
                            icon={<Lock size={18} />}
                          />
                        )}
                     </>
                   ) : authView === 'register-student' ? (
                     <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-4">
                           <Input label="Prénom" required value={studentData.firstName} onChange={e => setStudentData({...studentData, firstName: e.target.value})} />
                           <Input label="Nom" required value={studentData.lastName} onChange={e => setStudentData({...studentData, lastName: e.target.value})} />
                        </div>
                        <Input label="Email (@esmt.sn)" type="email" required value={studentData.email} onChange={e => setStudentData({...studentData, email: e.target.value})} icon={<Mail size={16}/>} />
                        <div className="grid grid-cols-2 gap-4">
                           <Input label="Pass" type="password" required value={studentData.password} onChange={e => setStudentData({...studentData, password: e.target.value})} />
                           <Input label="Confirm" type="password" required value={studentData.confirmPassword} onChange={e => setStudentData({...studentData, confirmPassword: e.target.value})} />
                        </div>
                        <div className="space-y-3">
                           <label className="text-sm font-bold text-ink-secondary uppercase tracking-wider">Allergies</label>
                           <div className="grid grid-cols-2 gap-3">
                              {allergyOptions.map(a => (
                                 <label key={a} className="flex items-center gap-2 p-4 bg-background rounded-2xl cursor-pointer hover:border-primary border border-transparent transition-all shadow-sm">
                                    <input type="checkbox" checked={studentData.allergies.includes(a)} onChange={e => {
                                       const news = e.target.checked ? [...studentData.allergies, a] : studentData.allergies.filter(x => x !== a);
                                       setStudentData({...studentData, allergies: news});
                                    }} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                                    <span className="text-sm font-bold text-ink-secondary capitalize">{a}</span>
                                 </label>
                              ))}
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        <Input label="Nom Complet" required value={clientData.fullName} onChange={e => setClientData({...clientData, fullName: e.target.value})} />
                        <Input label="Email" type="email" required value={clientData.email} onChange={e => setClientData({...clientData, email: e.target.value})} icon={<Mail size={16}/>} />
                        <div className="grid grid-cols-2 gap-4">
                           <Input label="Pass" type="password" required value={clientData.password} onChange={e => setClientData({...clientData, password: e.target.value})} />
                           <Input label="Confirm" type="password" required value={clientData.confirmPassword} onChange={e => setClientData({...clientData, confirmPassword: e.target.value})} />
                        </div>
                     </div>
                   )}

                   <Button type="submit" isLoading={loading} className="w-full py-6 text-base group">
                      {authView === 'login' ? "Entrer dans le Pilotage" : authView === 'forgot' ? "Récupérer l'accès" : "Commander maintenant"}
                      <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </Button>
                 </motion.form>
               </AnimatePresence>

               <div className="mt-10 pt-10 border-t border-gray-100 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-2">
                     {authView !== 'login' && <Button variant="secondary" size="sm" onClick={() => setAuthView('login')}>Connexion</Button>}
                     {authView !== 'register-student' && <Button variant="secondary" size="sm" onClick={() => setAuthView('register-student')} className="text-emerald-500">Étudiant ESMT</Button>}
                     {authView !== 'register-client' && <Button variant="secondary" size="sm" onClick={() => setAuthView('register-client')} className="text-blue-500">Client Externe</Button>}
                     {authView === 'login' && <Button variant="ghost" size="sm" onClick={() => setAuthView('forgot')} className="col-span-2">Accès perdu ?</Button>}
                  </div>
                  
                  <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
                     <ShieldCheck size={20} />
                     <Zap size={20} />
                     <Play size={20} fill="currentColor" />
                  </div>
               </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
