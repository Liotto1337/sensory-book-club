import { NextResponse } from "next/server";

export function jsonError(error: string, status: number, fieldErrors?: Record<string, string | undefined>) {
  return NextResponse.json({ error, fieldErrors }, { status });
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Защита от CSRF поверх SameSite=Lax: изменяющие запросы принимаем только со своего сайта.
 * Браузер всегда шлёт Origin в POST/DELETE; без заголовка приходят только не-браузерные клиенты,
 * у которых нет чужих cookie.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function forbiddenOrigin() {
  return jsonError("Запрос с чужого сайта отклонён", 403);
}
