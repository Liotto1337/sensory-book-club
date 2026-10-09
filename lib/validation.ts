// Общие правила для клиента и сервера: сервер повторяет те же проверки и не доверяет клиенту.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const EMAIL_MAX_LENGTH = 254;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 8;
// Верхняя граница не даёт отправить мегабайтный «пароль» в scrypt
export const PASSWORD_MAX_LENGTH = 128;
export const REVIEW_MIN_LENGTH = 10;
export const REVIEW_MAX_LENGTH = 1000;

export type AuthField = "name" | "email" | "password";
export type AuthErrors = Partial<Record<AuthField, string>>;
export type ReviewField = "rating" | "text";
export type ReviewErrors = Partial<Record<ReviewField, string>>;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): string | undefined {
  const normalized = normalizeEmail(email);
  if (!EMAIL_PATTERN.test(normalized) || normalized.length > EMAIL_MAX_LENGTH) {
    return "Введите корректный email";
  }
  return undefined;
}

export function validateRegistration(values: { name: string; email: string; password: string }): AuthErrors {
  const errors: AuthErrors = {};
  const name = values.name.trim();
  if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    errors.name = `Имя — от ${NAME_MIN_LENGTH} до ${NAME_MAX_LENGTH} символов`;
  }
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Пароль — не короче ${PASSWORD_MIN_LENGTH} символов`;
  } else if (values.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `Пароль — не длиннее ${PASSWORD_MAX_LENGTH} символов`;
  }
  return errors;
}

export function validateLogin(values: { email: string; password: string }): AuthErrors {
  const errors: AuthErrors = {};
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  if (!values.password) errors.password = "Введите пароль";
  else if (values.password.length > PASSWORD_MAX_LENGTH) errors.password = "Неверный email или пароль";
  return errors;
}

export function validateReview(values: { rating: number; text: string }): ReviewErrors {
  const errors: ReviewErrors = {};
  if (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5) {
    errors.rating = "Поставьте оценку от 1 до 5";
  }
  const text = values.text.trim();
  if (text.length < REVIEW_MIN_LENGTH) {
    errors.text = `Напишите хотя бы ${REVIEW_MIN_LENGTH} символов`;
  } else if (text.length > REVIEW_MAX_LENGTH) {
    errors.text = `Не больше ${REVIEW_MAX_LENGTH} символов`;
  }
  return errors;
}
