import { UserProfile } from "../types";

export const MOCK_USERS: Record<string, UserProfile> = {
  demo_student: {
    uid: "demo_student",
    email: "etudiant@esmt.sn",
    role: "STUDENT",
    displayName: "Ousmane Dieng",
    allergies: ["Arachides"],
    createdAt: new Date().toISOString()
  },
  demo_cook: {
    uid: "demo_cook",
    email: "chef.omar@esmt.sn",
    role: "COOK",
    displayName: "Chef Omar",
    createdAt: new Date().toISOString()
  },
  demo_admin: {
    uid: "demo_admin",
    email: "admin.fatou@esmt.sn",
    role: "ADMIN",
    displayName: "Fatou Admin",
    createdAt: new Date().toISOString()
  }
};

export const MOCK_LOYALTY = {
  points: 1250,
  tier: "Gold",
  nextReward: "Café Touba offert",
  pointsToNext: 250
};
