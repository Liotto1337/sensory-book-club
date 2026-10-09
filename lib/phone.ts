const COUNTRY_PREFIX = "+7";
const NATIONAL_LENGTH = 10;

/**
 * Достаёт 10 цифр национального номера из того, что ввёл или вставил пользователь.
 * Код страны («+7» из маски, «7» или «8» в начале вставленного номера) отбрасывается.
 */
export function toNationalDigits(input: string): string {
  const trimmed = input.trimStart();
  let digits: string;
  if (trimmed.startsWith(COUNTRY_PREFIX)) {
    digits = trimmed.slice(COUNTRY_PREFIX.length).replace(/\D/g, "");
  } else {
    digits = trimmed.replace(/\D/g, "");
    if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  }
  return digits.slice(0, NATIONAL_LENGTH);
}

/** «9001234567» → «+7 (900) 123-45-67»; неполный номер форматируется по мере ввода. */
export function formatPhone(national: string): string {
  if (!national) return "";
  const area = national.slice(0, 3);
  const first = national.slice(3, 6);
  const second = national.slice(6, 8);
  const third = national.slice(8, 10);

  let result = `${COUNTRY_PREFIX} (${area}`;
  if (national.length >= 3) result += ")";
  if (first) result += ` ${first}`;
  if (second) result += `-${second}`;
  if (third) result += `-${third}`;
  return result;
}

export function isCompletePhone(value: string): boolean {
  return toNationalDigits(value).length === NATIONAL_LENGTH;
}

/** Сколько цифр национального номера стоит в отформатированной строке до позиции `index`. */
export function countNationalDigitsBefore(formatted: string, index: number): number {
  const start = formatted.startsWith(COUNTRY_PREFIX) ? COUNTRY_PREFIX.length : 0;
  return formatted.slice(start, Math.max(index, start)).replace(/\D/g, "").length;
}

/** Позиция курсора сразу после `count`-й цифры национального номера. */
export function caretAfterNationalDigits(formatted: string, count: number): number {
  if (!formatted) return 0;
  const start = COUNTRY_PREFIX.length;
  if (count <= 0) return formatted.indexOf("(") + 1;
  let seen = 0;
  for (let index = start; index < formatted.length; index++) {
    if (/\d/.test(formatted[index]) && ++seen === count) return index + 1;
  }
  return formatted.length;
}
