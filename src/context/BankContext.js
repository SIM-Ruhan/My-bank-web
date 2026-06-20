"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const BankContext = createContext(null);
const DATA_PREFIX = "bankflow_data_v2_"; // + user email = storage key

const TAX_RATE = 0.05;

const EMPTY_STATE = { banks: [], transactions: [] };

function storageKeyFor(email) {
  return email ? DATA_PREFIX + email.toLowerCase() : null;
}

function loadStateFor(email) {
  if (typeof window === "undefined" || !email) return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(storageKeyFor(email));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.banks) && Array.isArray(parsed.transactions)) {
        return parsed;
      }
    }
  } catch (e) {
    /* ignore corrupt storage */
  }
  return EMPTY_STATE;
}

function saveStateFor(email, state) {
  if (typeof window === "undefined" || !email) return;
  try {
    window.localStorage.setItem(storageKeyFor(email), JSON.stringify(state));
  } catch (e) {
    /* storage full or unavailable — ignore */
  }
}

export function BankProvider({ children }) {
  const { currentUser, ready: authReady } = useAuth();
  const email = currentUser?.email ?? null;

  const [banks, setBanks]               = useState([]);
  const [transactions, setTransactions] = useState([]);
  const loadedFor = useRef(null); // tracks which email's data is currently loaded in state

  // Whenever the logged-in user changes (login/logout/switch account), load that user's data.
  useEffect(() => {
    if (!authReady) return;

    if (!email) {
      // Logged out — show empty/zero state
      setBanks([]);
      setTransactions([]);
      loadedFor.current = null;
      return;
    }

    if (loadedFor.current === email) return; // already loaded

    const state = loadStateFor(email);
    setBanks(state.banks);
    setTransactions(state.transactions);
    loadedFor.current = email;
  }, [email, authReady]);

  // Persist whenever data changes, but only once we've actually loaded a user's data
  // (prevents overwriting a user's saved data with an empty array during the load tick).
  useEffect(() => {
    if (!email || loadedFor.current !== email) return;
    saveStateFor(email, { banks, transactions });
  }, [banks, transactions, email]);

  const totalBalance = banks.reduce((sum, b) => sum + b.balance, 0);
  const isAuthenticated = !!email;

  function requireAuth(actionName = "perform this action") {
    if (!isAuthenticated) {
      return { ok: false, error: `Please log in to ${actionName}.` };
    }
    return { ok: true };
  }

  function addBank(bankData) {
    if (!isAuthenticated) return { ok: false, error: "Please log in to add a bank." };

    const newBank = {
      ...bankData,
      id:    Date.now().toString(),
      color: banks.length % 6,
    };
    setBanks((prev) => [...prev, newBank]);

    logTransaction({
      type:   "credit",
      bank:   bankData.bankName,
      desc:   "Account Linked",
      amount: bankData.balance,
    });

    return { ok: true, bank: newBank };
  }

  function deleteBank(id) {
    if (!isAuthenticated) return { ok: false, error: "Please log in." };

    const bank = banks.find((b) => b.id === id);
    setBanks((prev) => prev.filter((b) => b.id !== id));
    if (bank) {
      logTransaction({
        type:   "debit",
        bank:   bank.bankName,
        desc:   "Account Unlinked",
        amount: bank.balance,
      });
    }
    return { ok: true };
  }

  function logTransaction({ type, bank, desc, amount }) {
    const newTx = {
      id:     "t" + Date.now() + Math.random().toString(36).slice(2, 7),
      type,
      bank,
      desc,
      amount,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }

  // Accepts either a fully-formed transaction object ({id, type, bank, desc, amount, date})
  // or a partial one — fills in any missing id/date automatically.
  function addTransaction(tx) {
    const complete = {
      id:   tx.id   ?? "t" + Date.now() + Math.random().toString(36).slice(2, 7),
      date: tx.date ?? new Date().toISOString().split("T")[0],
      ...tx,
    };
    setTransactions((prev) => [complete, ...prev]);
    return complete;
  }

  function updateBankBalance(id, newBalance) {
    setBanks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, balance: newBalance } : b))
    );
  }

  // Generic helper: adjust a bank's balance by a signed delta and log a transaction.
  function adjustBalance(bankId, delta, desc) {
    const bank = banks.find((b) => b.id === bankId);
    if (!bank) return { ok: false, error: "Bank not found" };

    const newBalance = bank.balance + delta;
    if (newBalance < 0) {
      return { ok: false, error: "Insufficient balance" };
    }

    setBanks((prev) =>
      prev.map((b) => (b.id === bankId ? { ...b, balance: newBalance } : b))
    );

    logTransaction({
      type:   delta >= 0 ? "credit" : "debit",
      bank:   bank.bankName,
      desc,
      amount: Math.abs(delta),
    });

    return { ok: true, newBalance };
  }

  // Transfer between two of the user's own linked banks
  function transferBetweenBanks(fromId, toId, amount) {
    const from = banks.find((b) => b.id === fromId);
    const to   = banks.find((b) => b.id === toId);
    if (!from || !to) return { ok: false, error: "Invalid accounts" };
    if (from.id === to.id) return { ok: false, error: "Choose two different banks" };
    if (amount <= 0) return { ok: false, error: "Enter a valid amount" };
    if (from.balance < amount) return { ok: false, error: "Insufficient balance" };

    setBanks((prev) =>
      prev.map((b) => {
        if (b.id === from.id) return { ...b, balance: b.balance - amount };
        if (b.id === to.id)   return { ...b, balance: b.balance + amount };
        return b;
      })
    );

    logTransaction({ type: "debit",  bank: from.bankName, desc: `Transfer to ${to.bankName}`,   amount });
    logTransaction({ type: "credit", bank: to.bankName,   desc: `Transfer from ${from.bankName}`, amount });

    return { ok: true };
  }

  return (
    <BankContext.Provider
      value={{
        banks,
        totalBalance,
        transactions,
        TAX_RATE,
        isAuthenticated,
        requireAuth,
        addBank,
        deleteBank,
        addTransaction,
        updateBankBalance,
        adjustBalance,
        transferBetweenBanks,
      }}
    >
      {children}
    </BankContext.Provider>
  );
}

export function useBanks() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBanks must be used within BankProvider");
  return ctx;
}
