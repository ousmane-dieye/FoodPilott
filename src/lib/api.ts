import { auth } from "./firebase";
import { useAuthStore } from "../store/useAuthStore";

const BASE_URL = ""; // Relative to the window.location

export const api = {
  async fetch(url: string, options: RequestInit = {}) {
    // 1. ISOLATE DEMO MODE (Security Principle 3)
    if (useAuthStore.getState().isDemoMode) {
      console.warn(`[Demo Mode] Intercepted real API call to ${url}`);
      return {
        ok: true,
        json: async () => ({ message: "Demo mode: simulated response" }),
      };
    }

    const headers = new Headers(options.headers);

    // 2. INJECT FIREBASE ID TOKEN (Security Principle 1)
    const currentUser = auth.currentUser;
    if (currentUser) {
      const idToken = await currentUser.getIdToken();
      headers.set("Authorization", `Bearer ${idToken}`);
    }

    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "API request failed");
    }

    return response;
  },

  async get(url: string) {
    return this.fetch(url, { method: "GET" });
  },

  async post(url: string, data: any) {
    return this.fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
};
