import { NextResponse } from "next/server";
import { getLatestReviews } from "@/lib/server/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ reviews: getLatestReviews() }, { headers: { "Cache-Control": "no-store" } });
}
