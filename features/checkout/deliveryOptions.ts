import type { DeliveryOption } from "@/types";

export const deliveryOptions: DeliveryOption[] = [
  { id: "cdek", label: "СДЭК", hint: "До пункта выдачи, 2–5 дней" },
  { id: "post", label: "Почта России", hint: "В любой уголок страны, 5–10 дней" },
  { id: "courier", label: "Курьер", hint: "До двери, 1–2 дня" },
];
