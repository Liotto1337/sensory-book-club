import { create } from "zustand";
import type { Toast, ToastVariant } from "@/types";

const TOAST_DURATION_MS = 3000;

interface ToastState {
  toasts: Toast[];
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: number) => void;
}

let nextToastId = 1;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  showToast: (message, variant = "success") => {
    const id = nextToastId++;
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }));
    setTimeout(() => get().dismissToast(id), TOAST_DURATION_MS);
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
