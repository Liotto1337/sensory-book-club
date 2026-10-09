import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/db";
import { asString, forbiddenOrigin, isSameOrigin, jsonError, readJsonObject } from "@/lib/server/http";
import { getSessionUser } from "@/lib/server/session";
import { getSetById } from "@/lib/sets";
import { validateReview } from "@/lib/validation";
import type { Review, ReviewsResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

interface ReviewRow {
  id: number;
  rating: number;
  text: string;
  created_at: number;
  updated_at: number;
  user_id: number;
  author_name: string;
}

function loadReviews(setId: string, currentUserId: number | null): ReviewsResponse {
  const rows = getDb()
    .prepare(
      `SELECT reviews.id, reviews.rating, reviews.text, reviews.created_at, reviews.updated_at,
              reviews.user_id, users.name AS author_name
       FROM reviews JOIN users ON users.id = reviews.user_id
       WHERE reviews.set_id = ?
       ORDER BY reviews.created_at DESC`,
    )
    .all(setId) as ReviewRow[];

  const reviews: Review[] = rows.map((row) => ({
    id: row.id,
    rating: row.rating,
    text: row.text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: row.author_name,
    isOwn: row.user_id === currentUserId,
  }));
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    reviews,
    summary: { count: reviews.length, average: reviews.length ? total / reviews.length : null },
  };
}

export function GET(_request: Request, { params }: RouteContext) {
  if (!getSetById(params.id)) return jsonError("Набор не найден", 404);
  const user = getSessionUser();
  return NextResponse.json(loadReviews(params.id, user?.id ?? null), {
    headers: { "Cache-Control": "no-store" },
  });
}

/** Создаёт отзыв или обновляет свой: у пользователя один отзыв на набор. */
export async function POST(request: Request, { params }: RouteContext) {
  if (!isSameOrigin(request)) return forbiddenOrigin();
  if (!getSetById(params.id)) return jsonError("Набор не найден", 404);
  const user = getSessionUser();
  if (!user) return jsonError("Войдите, чтобы оставить отзыв", 401);

  const body = await readJsonObject(request);
  if (!body) return jsonError("Некорректный запрос", 400);
  const values = { rating: Number(body.rating), text: asString(body.text) };
  const fieldErrors = validateReview(values);
  if (Object.keys(fieldErrors).length > 0) return jsonError("Проверьте отзыв", 400, fieldErrors);

  const now = Date.now();
  getDb()
    .prepare(
      `INSERT INTO reviews (set_id, user_id, rating, text, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT (set_id, user_id) DO UPDATE SET
         rating = excluded.rating, text = excluded.text, updated_at = excluded.updated_at`,
    )
    .run(params.id, user.id, values.rating, values.text.trim(), now, now);

  return NextResponse.json(loadReviews(params.id, user.id));
}

export function DELETE(request: Request, { params }: RouteContext) {
  if (!isSameOrigin(request)) return forbiddenOrigin();
  const user = getSessionUser();
  if (!user) return jsonError("Войдите, чтобы удалить отзыв", 401);

  getDb().prepare("DELETE FROM reviews WHERE set_id = ? AND user_id = ?").run(params.id, user.id);
  return NextResponse.json(loadReviews(params.id, user.id));
}
