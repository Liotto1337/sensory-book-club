import { NextResponse } from "next/server";
import { getDb, isUniqueViolation } from "@/lib/server/db";
import { asString, forbiddenOrigin, isSameOrigin, jsonError, readJsonObject } from "@/lib/server/http";
import { hashPassword } from "@/lib/server/password";
import { createSession } from "@/lib/server/session";
import { normalizeEmail, validateRegistration } from "@/lib/validation";
import type { SessionUser } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_TAKEN = "Этот email уже зарегистрирован";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenOrigin();
  const body = await readJsonObject(request);
  if (!body) return jsonError("Некорректный запрос", 400);

  const values = { name: asString(body.name), email: asString(body.email), password: asString(body.password) };
  const fieldErrors = validateRegistration(values);
  if (Object.keys(fieldErrors).length > 0) return jsonError("Проверьте поля формы", 400, fieldErrors);

  const name = values.name.trim();
  const email = normalizeEmail(values.email);
  const db = getDb();
  if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) {
    return jsonError(EMAIL_TAKEN, 409, { email: EMAIL_TAKEN });
  }

  const passwordHash = await hashPassword(values.password);
  let userId: number;
  try {
    const result = db
      .prepare("INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, ?)")
      .run(email, name, passwordHash, Date.now());
    userId = Number(result.lastInsertRowid);
  } catch (error) {
    // Два одновременных запроса с одним email: второй упирается в UNIQUE
    if (isUniqueViolation(error)) return jsonError(EMAIL_TAKEN, 409, { email: EMAIL_TAKEN });
    throw error;
  }

  createSession(userId);
  const user: SessionUser = { id: userId, name, email };
  return NextResponse.json({ user }, { status: 201 });
}
