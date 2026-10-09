export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; fieldErrors?: Record<string, string | undefined> };

const NETWORK_ERROR = "Не удалось связаться с сервером. Проверьте подключение";

/** fetch с JSON в обе стороны; ошибки сервера и сети приходят одним типом, без исключений. */
export async function requestJson<T>(url: string, init: { method?: string; body?: unknown } = {}): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: init.method ?? (init.body === undefined ? "GET" : "POST"),
      headers: init.body === undefined ? undefined : { "Content-Type": "application/json" },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 0, error: NETWORK_ERROR };
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: payload?.error ?? "Что-то пошло не так. Попробуйте ещё раз",
      fieldErrors: payload?.fieldErrors,
    };
  }
  return { ok: true, data: payload as T };
}
