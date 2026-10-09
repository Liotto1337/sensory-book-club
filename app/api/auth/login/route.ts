import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { asString, forbiddenOrigin, isSameOrigin, jsonError, readJsonObject } from "@/lib/server/http";
import { clearFailures, getLockRemainingMs, recordFailure } from "@/lib/server/loginThrottle";
import { getDummyHash, verifyPassword } from "@/lib/server/password";
import { createSession } from "@/lib/server/session";
import { normalizeEmail, validateLogin } from "@/lib/validation";
import type { SessionUser } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface UserRow extends SessionUser {
  password_hash: string;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenOrigin();
  const body = await readJsonObject(request);
  if (!body) return jsonError("Некорректный запрос", 400);

  const values = { email: asString(body.email), password: asString(body.password) };
  const fieldErrors = validateLogin(values);
  if (Object.keys(fieldErrors).length > 0) return jsonError("Проверьте поля формы", 400, fieldErrors);

  const email = normalizeEmail(values.email);
  const lockMs = getLockRemainingMs(email);
  if (lockMs > 0) {
    const minutes = Math.ceil(lockMs / 60000);
    return jsonError(`Слишком много попыток входа. Попробуйте через ${minutes} мин.`, 429);
  }

  const row = getDb()
    .prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?")
    .get(email) as UserRow | undefined;
  const isValid = await verifyPassword(values.password, row?.password_hash ?? (await getDummyHash()));

  if (!row || !isValid) {
    recordFailure(email);
    // Одинаковый ответ для «нет такого email» и «неверный пароль»: не раскрываем, кто зарегистрирован
    return jsonError("Неверный email или пароль", 401);
  }

  clearFailures(email);
  createSession(row.id);
  const user: SessionUser = { id: row.id, name: row.name, email: row.email };
  return NextResponse.json({ user });
}
