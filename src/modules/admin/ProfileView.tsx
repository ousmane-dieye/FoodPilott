import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/useAuthStore";
import { User, ShieldCheck, Mail, Lock, Settings } from "lucide-react";
import { toast } from "sonner";

export default function ProfileView() {
  const { profile, user } = useAuthStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profil mis à jour avec succès");
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <header>
        <h2 className="text-5xl font-black tracking-tight text-ink italic uppercase">
          Profil Administrateur
        </h2>
        <p className="text-base font-bold text-ink-secondary uppercase tracking-widest mt-1">
          Gestion du compte et paramètres globaux
        </p>
      </header>

      <Card className="p-8 md:p-12 border-none shadow-large relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 p-8 text-gray-50 pointer-events-none rotate-12 scale-150">
           <ShieldCheck size={200} />
        </div>
        <div className="relative">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shadow-soft ring-4 ring-white">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} />
              )}
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight text-ink">
                {profile?.displayName || "Administrateur"}
              </h3>
              <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1 flex items-center gap-1">
                <ShieldCheck size={16} /> RÔLE : {profile?.role || "ADMIN"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input 
                 label="Nom Complet"
                 icon={<User size={18} />}
                 defaultValue={profile?.displayName || ""}
               />
               <Input 
                 label="Adresse Email"
                 type="email"
                 icon={<Mail size={18} />}
                 defaultValue={profile?.email || ""}
                 disabled
               />
               <Input 
                 label="Nouveau Mot de passe"
                 type="password"
                 icon={<Lock size={18} />}
                 placeholder="••••••••"
               />
               <Input 
                 label="Confirmer Mot de passe"
                 type="password"
                 icon={<Lock size={18} />}
                 placeholder="••••••••"
               />
            </div>

            <div className="pt-6 border-t border-gray-100">
               <h4 className="font-bold text-lg text-ink flex items-center gap-2 mb-6">
                 <Settings size={20} className="text-primary"/> Préférences Système
               </h4>
               <div className="space-y-4">
                 <label className="flex items-center gap-3 cursor-pointer">
                   <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                   <span className="font-medium text-ink">Recevoir un rapport journalier par e-mail</span>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer">
                   <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                   <span className="font-medium text-ink">Activer les alertes de stock critiques</span>
                 </label>
               </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="px-10 h-14 rounded-2xl bg-ink hover:bg-slate-800 text-white font-bold tracking-widest uppercase">
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
