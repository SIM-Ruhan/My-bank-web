import Link from "next/link";
import { Landmark, Shield, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-700">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Landmark size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                My<span className="text-indigo-400">Bank</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              All your bank accounts in one elegant dashboard. Secure, fast, and always up to date.
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-500 font-medium">
              <Shield size={12} />
              Bank-grade encryption
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Dashboard",       href: "/" },
                { label: "Add Bank",        href: "/add-bank" },
                { label: "Transactions",    href: "/transactions" },
                { label: "Tax Calculation", href: "/tax-calculation" },
                { label: "Profile",         href: "/profile" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "Balance Transfer",
                "Mobile Recharge",
                "Bill Payment",
                "Insurance",
                "Loan Management",
                "Savings Plans",
              ].map((s) => (
                <li key={s} className="flex items-center gap-1.5">
                  <Zap size={10} className="text-indigo-400 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <p>© 2026 MyBank. All rights reserved.</p>
          <p className="text-slate-700">
            Built for demonstration purposes only. Not a real financial service.
          </p>
        </div>
      </div>
    </footer>
  );
}
