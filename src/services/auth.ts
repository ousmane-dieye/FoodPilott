import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { UserProfile, UserRole } from '../types';
import { handleFirestoreError } from '../lib/error-handler';
import { toast } from 'sonner';

const googleProvider = new GoogleAuthProvider();

export const AuthService = {
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return await this.syncProfile(result.user);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  },

  async loginWithEmail(email: string, pass: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return await this.syncProfile(result.user);
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    }
  },

  async registerStudent(data: {
    email: string;
    pass: string;
    firstName: string;
    lastName: string;
    phone?: string;
    allergies: string[];
    otherAllergies?: string;
  }) {
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      const user = result.user;
      
      const role: UserRole = 'STUDENT';
      const userRef = doc(db, 'users', user.uid);
      
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        role,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: `${data.firstName} ${data.lastName}`,
        phoneNumber: data.phone,
        allergies: data.allergies,
        otherAllergies: data.otherAllergies,
        points: 0,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(userRef, newProfile);
      useAuthStore.getState().setProfile(newProfile);
      return newProfile;
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    }
  },

  async registerClient(data: {
    email: string;
    pass: string;
    fullName: string;
    phone?: string;
  }) {
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      const user = result.user;
      
      const role: UserRole = 'CLIENT';
      const userRef = doc(db, 'users', user.uid);
      
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        role,
        fullName: data.fullName,
        displayName: data.fullName,
        phoneNumber: data.phone,
        points: 0,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(userRef, newProfile);
      useAuthStore.getState().setProfile(newProfile);
      return newProfile;
    } catch (error: any) {
      this.handleAuthError(error);
      throw error;
    }
  },

  handleAuthError(error: any) {
    let message = "Une erreur est survenue lors de l'authentification.";
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = "Cet email est déjà utilisé par un autre compte.";
        break;
      case 'auth/weak-password':
        message = "Le mot de passe est trop faible (6 caractères minimum).";
        break;
      case 'auth/invalid-email':
        message = "L'adresse email n'est pas valide.";
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
        message = "Identifiants invalides (E-mail ou mot de passe incorrect).";
        break;
      case 'auth/user-not-found':
        message = "Aucun utilisateur trouvé avec cet email.";
        break;
      case 'auth/user-disabled':
        message = "Ce compte a été désactivé.";
        break;
      case 'auth/too-many-requests':
        message = "Trop de tentatives échouées. Veuillez réessayer plus tard.";
        break;
      case 'auth/popup-closed-by-user':
        message = "Fenêtre de connexion fermée par l'utilisateur.";
        break;
      case 'auth/operation-not-allowed':
        message = "Cette méthode d'authentification n'est pas activée.";
        break;
    }
    
    toast.error(message);
    console.error("Firebase Auth Error:", error.code, message, error.message);
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  async loginAsDemo(role: UserRole) {
    // Mock user and profile for demo
    const mockUser = {
      uid: `demo_${role.toLowerCase()}`,
      email: `demo@${role.toLowerCase()}.com`,
      displayName: `Demo ${role}`,
      getIdToken: async () => `demo_token_${role.toLowerCase()}`
    } as any; // Cast as any to include mock method

    const mockProfile: UserProfile = {
      uid: mockUser.uid,
      email: mockUser.email!,
      role,
      displayName: mockUser.displayName!,
      points: role === 'STUDENT' ? 1250 : 0,
      createdAt: new Date().toISOString(),
    };

    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setProfile(mockProfile);
    useAuthStore.getState().setDemoMode(true);
    useAuthStore.getState().setLoading(false);
    return mockProfile;
  },

  async logout() {
    if (useAuthStore.getState().isDemoMode) {
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setProfile(null);
      useAuthStore.getState().setDemoMode(false);
    } else {
      await signOut(auth);
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setProfile(null);
    }
  },

  async syncProfile(user: User) {
    const userRef = doc(db, 'users', user.uid);
    try {
      // Small delay to allow registration process to settle if concurrent
      const snap = await getDoc(userRef);
      
      if (!snap.exists()) {
        // Only auto-create if we are NOT in registration flow (e.g. Google Login first time)
        // We use safe defaults that comply with Firestore rules
        const nameParts = (user.displayName || user.email?.split('@')[0] || 'Utilisateur Inconnu').split(' ');
        const firstName = nameParts[0] || 'Utilisateur';
        const lastName = nameParts.slice(1).join(' ') || 'ESMT';

        const role: UserRole = 'STUDENT';

        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          role,
          firstName,
          lastName,
          displayName: user.displayName || `${firstName} ${lastName}`,
          points: 0,
          createdAt: serverTimestamp(),
        };
        
        try {
          await setDoc(userRef, newProfile);
          useAuthStore.getState().setProfile(newProfile);
          return newProfile;
        } catch (setErr: any) {
          // If the rule still rejects, it might be due to a race with registerStudent
          // we wait a bit and retry looking for the document
          await new Promise(r => setTimeout(r, 800));
          const retrySnap = await getDoc(userRef);
          if (retrySnap.exists()) {
            const p = retrySnap.data() as UserProfile;
            useAuthStore.getState().setProfile(p);
            return p;
          }
          throw setErr;
        }
      } else {
        const profile = snap.data() as UserProfile;
        useAuthStore.getState().setProfile(profile);
        return profile;
      }
    } catch (error: any) {
      console.error("Profile sync error:", error);
      // Propagate error for login flow but keep it manageable
      if (error.code === 'permission-denied') {
        throw new Error("Accès au profil refusé. Vérifiez vos permissions.");
      }
      throw error;
    }
  },

  init() {
    onAuthStateChanged(auth, async (user) => {
      // If we are already in demo mode, don't let onAuthStateChanged overwrite it
      if (useAuthStore.getState().isDemoMode) return;

      useAuthStore.getState().setUser(user);
      if (user) {
        await this.syncProfile(user);
      }
      useAuthStore.getState().setLoading(false);
    });
  }
};
