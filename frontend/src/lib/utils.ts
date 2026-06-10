import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check password strength for the registration form
 */
export function checkPasswordStrength(password: string) {
  if (!password) {
    return {
      score: 0,
      label: "",
      color: "bg-gray-200",
    };
  }

  let score = 0;

  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) { return {score: 1,label: "Débil",color: "bg-red-500 text-red-500",};}

  if (score <= 3) { return {score: 2,label: "Intermedia",color: "bg-yellow-500 text-yellow-500",};}

  return {score: 3,label: "Fuerte",color: "bg-emerald-500 text-emerald-500",};
}
