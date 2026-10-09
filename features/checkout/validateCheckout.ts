import { isCompletePhone } from "@/lib/phone";
import { validateEmail } from "@/lib/validation";
import type { CheckoutErrors, CheckoutFormValues } from "@/types";

export function validateCheckout(values: CheckoutFormValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Укажите имя";
  }
  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }
  if (!isCompletePhone(values.phone)) {
    errors.phone = "Введите номер телефона полностью";
  }
  if (values.address.trim().length < 5) {
    errors.address = "Укажите адрес доставки";
  }

  return errors;
}
