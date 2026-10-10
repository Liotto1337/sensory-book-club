import type { LatestReview } from "@/types";
import { getDb } from "./db";

const LATEST_MIN_RATING = 4;

interface LatestReviewRow {
  id: number;
  set_id: string;
  rating: number;
  text: string;
  created_at: number;
  author_name: string;
}

/** Свежие отзывы с высокой оценкой со всех наборов — для ленты на главной. */
export function getLatestReviews(limit = 10): LatestReview[] {
  const rows = getDb()
    .prepare(
      `SELECT reviews.id, reviews.set_id, reviews.rating, reviews.text, reviews.created_at, users.name AS author_name
       FROM reviews JOIN users ON users.id = reviews.user_id
       WHERE reviews.rating >= ?
       ORDER BY reviews.created_at DESC
       LIMIT ?`,
    )
    .all(LATEST_MIN_RATING, limit) as LatestReviewRow[];

  return rows.map((row) => ({
    id: row.id,
    setId: row.set_id,
    rating: row.rating,
    text: row.text,
    authorName: row.author_name,
    createdAt: row.created_at,
  }));
}
