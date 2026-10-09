import { NextResponse } from "next/server";
import { asString, forbiddenOrigin, isSameOrigin, jsonError, readJsonObject } from "@/lib/server/http";
import type { AddressSuggestion } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DADATA_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const MIN_QUERY_LENGTH = 3;
const MAX_QUERY_LENGTH = 300;
const SUGGESTIONS_COUNT = 5;
const TIMEOUT_MS = 4000;

interface DadataSuggestion {
  value: string;
  data?: { house?: string | null };
}

/**
 * Прокси к подсказкам DaData: токен остаётся на сервере и не попадает в браузер.
 * Без DADATA_API_KEY отвечает 503, и поле адреса работает как обычное текстовое.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenOrigin();
  const apiKey = process.env.DADATA_API_KEY;
  if (!apiKey) return jsonError("Подсказки адреса не настроены", 503);

  const body = await readJsonObject(request);
  const query = asString(body?.query).trim();
  if (query.length < MIN_QUERY_LENGTH || query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const response = await fetch(DADATA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({ query, count: SUGGESTIONS_COUNT }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error(`DaData ответил ${response.status}`);
      return jsonError("Сервис подсказок недоступен", 502);
    }
    const data = (await response.json()) as { suggestions?: DadataSuggestion[] };
    const suggestions: AddressSuggestion[] = (data.suggestions ?? []).map((item) => ({
      value: item.value,
      hasHouse: Boolean(item.data?.house),
    }));
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Ошибка запроса к DaData", error);
    return jsonError("Сервис подсказок недоступен", 502);
  }
}
