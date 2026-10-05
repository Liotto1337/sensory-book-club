import type { CheckoutErrors, CheckoutFormValues } from "@/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PHONE_DIGITS = 10;

export function validateCheckout(values: CheckoutFormValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Укажите имя";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Введите корректный email";
  }
  if (values.phone.replace(/\D/g, "").length < MIN_PHONE_DIGITS) {
    errors.phone = "Введите номер телефона полностью";
  }
  if (values.address.trim().length < 5) {
    errors.address = "Укажите адрес доставки";
  }

  return errors;
}
