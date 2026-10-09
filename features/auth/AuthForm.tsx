"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { requestJson } from "@/lib/api";
import { safeRedirectPath } from "@/lib/safeRedirect";
import { PASSWORD_MIN_LENGTH, validateLogin, validateRegistration, type AuthErrors, type AuthField } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import type { SessionUser } from "@/types";

type AuthMode = "login" | "register";

const copy: Record<AuthMode, { title: string; submit: string; endpoint: string; switchText: string; switchLink: string; switchHref: string }> = {
  login: {
    title: "Вход",
    submit: "Войти",
    endpoint: "/api/auth/login",
    switchText: "Ещё нет аккаунта?",
    switchLink: "Зарегистрироваться",
    switchHref: "/register",
  },
  register: {
    title: "Регистрация",
    submit: "Создать аккаунт",
    endpoint: "/api/auth/register",
    switchText: "Уже есть аккаунт?",
    switchLink: "Войти",
    switchHref: "/login",
  },
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeRedirectPath(searchParams.get("next"));
  const status = useAuthStore((state) => state.status);
  const setUser = useAuthStore((state) => state.setUser);
  const showToast = useToastStore((state) => state.showToast);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<AuthErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const text = copy[mode];

  // Уже вошли (например, открыли /login из закладки) — сразу дальше
  useEffect(() => {
    if (status === "authenticated" && !isSubmitting) router.replace(nextPath);
  }, [status, isSubmitting, nextPath, router]);

  const updateField = (field: AuthField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = mode === "register" ? validateRegistration(values) : validateLogin(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const body = mode === "register" ? values : { email: values.email, password: values.password };
    const result = await requestJson<{ user: SessionUser }>(text.endpoint, { body });

    if (!result.ok) {
      setIsSubmitting(false);
      setErrors(result.fieldErrors ?? {});
      if (!result.fieldErrors) setFormError(result.error);
      return;
    }
    setUser(result.data.user);
    showToast(mode === "register" ? `Добро пожаловать, ${result.data.user.name}!` : "Вы вошли в аккаунт");
    router.replace(nextPath);
  };

  const switchHref = nextPath === "/" ? text.switchHref : `${text.switchHref}?next=${encodeURIComponent(nextPath)}`;

  return (
    <section className="mx-auto w-full max-w-md px-4 py-12 sm:py-20">
      <div className="rounded-card bg-linen p-6 shadow-soft sm:p-8">
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">{text.title}</h1>
        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          {mode === "register" && (
            <Input
              label="Имя"
              name="name"
              autoComplete="name"
              placeholder="Анна"
              value={values.name}
              error={errors.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="anna@example.com"
            value={values.email}
            error={errors.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
          <Input
            label="Пароль"
            name="password"
            type="password"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            placeholder={mode === "register" ? `Не короче ${PASSWORD_MIN_LENGTH} символов` : undefined}
            value={values.password}
            error={errors.password}
            onChange={(event) => updateField("password", event.target.value)}
          />
          {formError && (
            <p role="alert" className="rounded-control bg-terracotta-light/60 px-4 py-3 text-sm text-terracotta-dark">
              {formError}
            </p>
          )}
          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? <Spinner /> : text.submit}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-muted">
          {text.switchText}{" "}
          <Link href={switchHref} className="font-medium text-terracotta-dark hover:underline">
            {text.switchLink}
          </Link>
        </p>
      </div>
    </section>
  );
}
