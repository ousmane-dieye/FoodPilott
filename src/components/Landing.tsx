import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  ChefHat, 
  BarChart3, 
  ChevronRight, 
  Mail, 
  Lock, 
  ArrowRight, 
  Play,
  ShieldCheck,
  Zap,
  Sparkles
} from "lucide-react";
import { cn } from "../lib/utils";
import { AuthService } from "../services/auth";
import { useAuthStore } from "../store/useAuthStore";
import { UserRole } from "../types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function Landing() {
  const { user, isDemoMode } = useAuthStore();
  const navigate = useNavigate();
  const [authView, setAuthView] = useState<'login' | 'register-student' | 'register-client' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  
  // Registration data
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    allergies: [] as string[],
    otherAllergies: ''
  });

  const [clientData, setClientData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const allergyOptions = [
    'arachides', 'lactose', 'gluten', 'fruits de mer', 'œufs', 'soja'
  ];

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
      case 'CLIENT': navigate('/student/order'); break; // Clients use same student interface for now or specific CustomerApp
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
        toast.success("Compte étudiant créé avec succès !");
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
        toast.success("Compte client créé avec succès !");
        navigate('/student/order');
      } else {
        await AuthService.resetPassword(loginData.email);
        toast.success("Lien de réinitialisation envoyé !");
        setAuthView('login');
      }
    } catch (error: any) {
      // If the error was already handled by AuthService (toast shown), we just stop
      // If it's a local error (like password mismatch), we show it here
      if (error.message && !error.code) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const demoCards = [
    {
      role: 'STUDENT' as UserRole,
      title: 'Étudiant (Test)',
      desc: 'Simuler l\'interface étudiant instantanément',
      icon: User,
      color: 'bg-emerald-500',
      shadow: 'shadow-emerald-200'
    },
    {
      role: 'COOK' as UserRole,
      title: 'Cuisine (Test)',
      desc: 'Accès rapide aux outils de production',
      icon: ChefHat,
      color: 'bg-orange-500',
      shadow: 'shadow-orange-200'
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'Admin (Test)',
      desc: 'Vue d\'ensemble et analytics pilotage',
      icon: BarChart3,
      color: 'bg-blue-600',
      shadow: 'shadow-blue-200'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-12 px-4">
      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-4 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
          <Sparkles size={12} />
          Innovation ESMT 2026
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
          FoodPilot <br/>
          <span className="text-gray-300 italic font-serif">Hybrid Pilot</span>
        </h1>
        <p className="text-gray-400 font-medium">
          Connectez-vous à votre espace personnel ou testez instantanément l'interface en mode démonstration.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Demo Mode */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
              <Play size={20} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Accès Rapide (Hackathon)</h2>
              <p className="text-sm text-gray-400 font-medium italic">Testez sans authentification</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {demoCards.map((card, idx) => (
              <motion.button
                key={card.role}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleDemoMode(card.role)}
                className={cn(
                  "group relative flex items-center gap-6 p-6 rounded-[32px] bg-white border border-gray-100 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-emerald-100 text-left overflow-hidden"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform shadow-lg",
                  card.color,
                  card.shadow
                )}>
                  <card.icon size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">{card.title}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mb-2 opacity-60">Rôle : {card.role}</p>
                  <p className="text-sm text-gray-400 font-medium leading-tight">{card.desc}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                  <ArrowRight size={20} />
                </div>
                <div className={cn(
                  "absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity",
                  card.color
                )} />
              </motion.button>
            ))}
          </div>
          
          <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-[32px] flex items-start gap-4">
             <div className="w-10 h-10 shrink-0 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-500">
                <Zap size={20} />
             </div>
             <p className="text-[13px] text-emerald-800 font-medium leading-relaxed">
               <strong>Note :</strong> Le mode démo bypass l'authentification réelle. Idéal pour les présentations rapides. Les données peuvent être persistées via Firestore si configuré.
             </p>
          </div>
        </motion.div>

        {/* Right Side: Auth Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-gray-100 -mr-8 -mt-8">
            <Lock size={120} />
          </div>

          <div className="relative">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Authentification</h2>
            <p className="text-sm text-gray-400 font-medium mb-8">Accès sécurisé FoodPilot Network</p>

            <form onSubmit={handleAuth} className="space-y-4">
              {authView === 'login' || authView === 'forgot' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="email" 
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        placeholder="votre.email@domaine.com"
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  {authView === 'login' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                          type="password" 
                          required
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          placeholder="••••••••"
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : authView === 'register-student' ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
                      <input 
                        type="text" required
                        value={studentData.firstName}
                        onChange={(e) => setStudentData({...studentData, firstName: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom</label>
                      <input 
                        type="text" required
                        value={studentData.lastName}
                        onChange={(e) => setStudentData({...studentData, lastName: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email (@esmt.sn recommandé)</label>
                    <input 
                      type="email" required
                      value={studentData.email}
                      onChange={(e) => setStudentData({...studentData, email: e.target.value})}
                      placeholder="nom.prenom@esmt.sn"
                      className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
                      <input 
                        type="password" required
                        value={studentData.password}
                        onChange={(e) => setStudentData({...studentData, password: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmation</label>
                      <input 
                        type="password" required
                        value={studentData.confirmPassword}
                        onChange={(e) => setStudentData({...studentData, confirmPassword: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone (Optionnel)</label>
                    <input 
                      type="tel"
                      value={studentData.phone}
                      onChange={(e) => setStudentData({...studentData, phone: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Allergies</label>
                    <div className="grid grid-cols-2 gap-2">
                      {allergyOptions.map(allergy => (
                        <label key={allergy} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                          <input 
                            type="checkbox"
                            checked={studentData.allergies.includes(allergy)}
                            onChange={(e) => {
                              const newAllergies = e.target.checked 
                                ? [...studentData.allergies, allergy]
                                : studentData.allergies.filter(a => a !== allergy);
                              setStudentData({...studentData, allergies: newAllergies});
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-xs font-bold text-gray-600 capitalize">{allergy}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Autres allergies</label>
                    <input 
                      type="text"
                      value={studentData.otherAllergies}
                      onChange={(e) => setStudentData({...studentData, otherAllergies: e.target.value})}
                      placeholder="Ex: Fraises, Kiwi..."
                      className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom Complet</label>
                    <input 
                      type="text" required
                      value={clientData.fullName}
                      onChange={(e) => setClientData({...clientData, fullName: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <input 
                      type="email" required
                      value={clientData.email}
                      onChange={(e) => setClientData({...clientData, email: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
                      <input 
                        type="password" required
                        value={clientData.password}
                        onChange={(e) => setClientData({...clientData, password: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmation</label>
                      <input 
                        type="password" required
                        value={clientData.confirmPassword}
                        onChange={(e) => setClientData({...clientData, confirmPassword: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone (Optionnel)</label>
                    <input 
                      type="tel"
                      value={clientData.phone}
                      onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-2xl py-4 font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl disabled:opacity-50 mt-4"
              >
                {loading ? "Chargement..." : 
                  authView === 'login' ? "Se Connecter" : 
                  authView === 'forgot' ? "Réinitialiser" : "Créer mon compte"}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 w-full">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Navigation</span>
                <div className="h-px bg-gray-100 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                {authView !== 'login' && (
                  <button onClick={() => setAuthView('login')} className="bg-gray-50 text-gray-500 py-3 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Connexion</button>
                )}
                {authView !== 'register-student' && (
                  <button onClick={() => setAuthView('register-student')} className="bg-emerald-50 text-emerald-600 py-3 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors">Inscription ESMT</button>
                )}
                {authView !== 'register-client' && (
                  <button onClick={() => setAuthView('register-client')} className="bg-blue-50 text-blue-600 py-3 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">Inscription Client</button>
                )}
                {authView === 'login' && (
                  <button onClick={() => setAuthView('forgot')} className="bg-gray-50 text-gray-400 py-3 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors">Mot de passe oublié</button>
                )}
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  <strong>Personnel ESMT :</strong> Les comptes <i>Cook</i> et <i>Admin</i> ne sont pas ouverts à l'inscription publique. Contactez le département IT pour obtenir vos accès.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-center gap-6 opacity-30 grayscale">
             <ShieldCheck size={20} />
             <Zap size={20} />
             <Sparkles size={20} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
