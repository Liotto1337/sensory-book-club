import { NextResponse } from "next/server";
import { forbiddenOrigin, isSameOrigin } from "@/lib/server/http";
import { destroySession } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenOrigin();
  destroySession();
  return NextResponse.json({ ok: true });
}
