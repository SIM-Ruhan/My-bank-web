"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

const AuthContext = createContext(null);

const USERS_KEY    = "bankflow_users_v1";    // all registered accounts
const SESSION_KEY   = "bankflow_session_v1";  // currently logged-in email

function loadUsers() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    /* storage unavailable — ignore */
  }
}

function loadSession() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch (e) {
    return null;
  }
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

export function AuthProvider({ children }) {
  const [users, setUsers]               = useState([]);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [ready, setReady]               = useState(false);
  const booted = useRef(false);

  // Hydrate from localStorage once, on the client only (avoids SSR/client mismatch)
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    setUsers(loadUsers());
    setCurrentEmail(loadSession());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveUsers(users);
  }, [users, ready]);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    try {
      if (currentEmail) window.localStorage.setItem(SESSION_KEY, currentEmail);
      else window.localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      /* ignore */
    }
  }, [currentEmail, ready]);

  const currentUser = currentEmail
    ? users.find((u) => u.email.toLowerCase() === currentEmail.toLowerCase()) ?? null
    : null;

  const isAuthenticated = !!currentUser;

  function register({ name, email, phone, password }) {
    const cleanEmail = email.trim().toLowerCase();

    if (!name || !name.trim())          return { ok: false, error: "Full name is required." };
    if (!cleanEmail)                     return { ok: false, error: "Email is required." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
                                          return { ok: false, error: "Enter a valid email address." };
    if (!password || password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    if (users.some((u) => u.email.toLowerCase() === cleanEmail))
                                          return { ok: false, error: "An account with this email already exists." };

    const newUser = {
      id:       "u" + Date.now(),
      name:     name.trim(),
      email:    cleanEmail,
      phone:    phone?.trim() || "",
      password, // demo only — plaintext storage is NOT how real apps should do this
      initials: initials(name),
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    return { ok: true, user: newUser };
  }

  function login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const match = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!match)                  return { ok: false, error: "No account found with this email." };
    if (match.password !== password) return { ok: false, error: "Incorrect password." };

    setCurrentEmail(match.email);
    return { ok: true, user: match };
  }

  function logout() {
    setCurrentEmail(null);
  }

  return (
    <AuthContext.Provider
      value={{
        ready,
        users,
        currentUser,
        isAuthenticated,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
