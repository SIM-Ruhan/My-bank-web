"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { BankProvider } from "@/context/BankContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <BankProvider>{children}</BankProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
