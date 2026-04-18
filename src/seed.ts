import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = admin.firestore();

async function seedAdmin(email: string, uid: string) {
  console.log(`Seeding Admin: ${email} (${uid})`);
  
  await db.collection("users").doc(uid).set({
    uid,
    email,
    role: "ADMIN",
    displayName: "Super Admin",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log("✅ Admin seeded successfully!");
}

// Usage: tsx seed.ts <email> <uid>
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: tsx seed.ts <email> <uid>");
  process.exit(1);
}

seedAdmin(args[0], args[1]).catch(console.error);
