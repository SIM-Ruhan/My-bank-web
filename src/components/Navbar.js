"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBanks } from "@/context/BankContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/lib/utils";
import {
  Landmark, ChevronDown, User, Receipt, LogOut, Bell, TrendingUp, LogIn, UserPlus,
} from "lucide-react";

export default function Navbar() {
  const { totalBalance } = useBanks();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    setOpen(false);
    logout();
    showToast("Logged out successfully.", "info");
    router.push("/");
  }

  return (
    <nav className="glass-nav sticky top-0 z-50" style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.07),0 4px 20px rgba(0,0,0,0.05)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl grad-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Landmark size={17} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[1.1rem] font-extrabold text-slate-800 leading-none">
                My<span className="text-indigo-600">Bank</span>
              </p>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">All banks. One place.</p>
            </div>
          </Link>

          {/* Total Balance */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <TrendingUp size={11} className="text-emerald-500" />
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Total Balance</span>
            </div>
            <p className="number-display text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {formatCurrency(totalBalance)}
            </p>
          </div>

          {/* Right side */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 shrink-0">
              <button className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-indigo-50 flex items-center justify-center transition-colors">
                <Bell size={15} className="text-slate-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
              </button>

              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg grad-primary flex items-center justify-center text-white text-xs font-bold shadow">
                    {currentUser.initials}
                  </div>
                  <span className="hidden md:block text-sm font-semibold text-slate-700">{currentUser.name.split(" ")[0]}</span>
                  <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                  <div className="dropdown-enter absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gradient-to-br from-indigo-50 to-violet-50 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
                    </div>
                    <div className="py-1.5">
                      <DropItem icon={<User size={14} />} label="See Profile"   onClick={() => { setOpen(false); router.push("/profile"); }} />
                      <DropItem icon={<Receipt size={14} />} label="Transactions" onClick={() => { setOpen(false); router.push("/transactions"); }} />
                      <div className="my-1 mx-3 border-t border-slate-100" />
                      <DropItem icon={<LogOut size={14} />} label="Log Out" danger onClick={handleLogout} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <LogIn size={14} />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white grad-primary shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                <UserPlus size={14} />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function DropItem({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors
      ${danger ? "text-red-500 hover:bg-red-50" : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"}`}>
      <span className={danger ? "text-red-400" : "text-indigo-400"}>{icon}</span>
      {label}
    </button>
  );
}
