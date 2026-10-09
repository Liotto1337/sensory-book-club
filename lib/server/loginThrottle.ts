// Ограничение подбора пароля: после MAX_FAILURES неудачных попыток вход по этому email
// закрывается на WINDOW_MS. Счётчик живёт в памяти процесса — для одного сервера этого достаточно.
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

interface Attempts {
  failures: number;
  resetAt: number;
}

const globalForThrottle = globalThis as typeof globalThis & { sensoryLoginAttempts?: Map<string, Attempts> };
const attempts = (globalForThrottle.sensoryLoginAttempts ??= new Map());

/** Сколько миллисекунд ещё ждать; 0 — можно пробовать. */
export function getLockRemainingMs(email: string): number {
  const entry = attempts.get(email);
  if (!entry) return 0;
  if (entry.resetAt <= Date.now()) {
    attempts.delete(email);
    return 0;
  }
  return entry.failures >= MAX_FAILURES ? entry.resetAt - Date.now() : 0;
}

export function recordFailure(email: string): void {
  const now = Date.now();
  const entry = attempts.get(email);
  if (!entry || entry.resetAt <= now) {
    attempts.set(email, { failures: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.failures += 1;
  }
}

export function clearFailures(email: string): void {
  attempts.delete(email);
}
