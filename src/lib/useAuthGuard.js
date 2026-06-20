"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

/**
 * Returns a `guard()` function. Call guard() before any protected action
 * (opening a modal, navigating to add-bank, etc). If the user is not
 * logged in, it shows a "Login required!" toast, redirects to /login,
 * and returns false. If logged in, it returns true and does nothing else.
 *
 * Usage:
 *   const guard = useAuthGuard();
 *   function handleClick() {
 *     if (!guard()) return;
 *     // ... proceed with protected action
 *   }
 */
export function useAuthGuard() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  return function guard(redirectTo = "/login") {
    if (isAuthenticated) return true;
    showToast("Login required!", "warning");
    router.push(redirectTo);
    return false;
  };
}
