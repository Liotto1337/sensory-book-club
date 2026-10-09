import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/features/auth/AuthForm";

export const metadata: Metadata = {
  title: "Вход — Сенсорный книжный клуб",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
