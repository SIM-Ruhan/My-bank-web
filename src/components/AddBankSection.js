"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { Plus, ArrowRight } from "lucide-react";

export default function AddBankSection() {
  const router = useRouter();
  const guard = useAuthGuard();

  function handleClick() {
    if (!guard()) return;
    router.push("/add-bank");
  }

  return (
    <button onClick={handleClick} className="block w-full text-left group">
      <div
        className="relative rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50
          hover:from-indigo-100 hover:to-violet-100 hover:border-indigo-400
          transition-all duration-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer overflow-hidden"
      >
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl grad-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow shrink-0">
            <Plus size={26} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Add a New Bank
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Link another bank account to your dashboard
            </p>
          </div>
        </div>

        {/* Right arrow */}
        <div className="flex items-center gap-2 text-indigo-500 font-semibold text-sm group-hover:gap-3 transition-all shrink-0">
          <span>Get Started</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Decorative */}
        <div className="absolute top-3 right-3 opacity-10 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-indigo-400" />
        </div>
      </div>
    </button>
  );
}
