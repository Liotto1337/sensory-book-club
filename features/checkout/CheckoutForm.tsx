"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { generateOrderNumber } from "@/lib/generateOrderNumber";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { CheckoutErrors, CheckoutFormValues, CheckoutTextField } from "@/types";
import { DeliveryOptions } from "./DeliveryOptions";
import { validateCheckout } from "./validateCheckout";

const PAYMENT_DELAY_MS = 1500;

const initialValues: CheckoutFormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  delivery: "cdek",
};

interface CheckoutFormProps {
  onSubmittingChange: (isSubmitting: boolean) => void;
}

export function CheckoutForm({ onSubmittingChange }: CheckoutFormProps) {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const showToast = useToastStore((state) => state.showToast);
  const [values, setValues] = useState<CheckoutFormValues>(initialValues);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: CheckoutTextField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateCheckout(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      showToast("Проверьте, пожалуйста, заполненные поля", "error");
      return;
    }

    setIsSubmitting(true);
    onSubmittingChange(true);
    setTimeout(() => {
      clearCart();
      router.push(`/thanks?order=${generateOrderNumber()}`);
    }, PAYMENT_DELAY_MS);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Имя" name="name" autoComplete="name" placeholder="Анна" value={values.name} error={errors.name} onChange={(event) => updateField("name", event.target.value)} />
        <Input label="Телефон" name="phone" type="tel" autoComplete="tel" placeholder="+7 900 000-00-00" value={values.phone} error={errors.phone} onChange={(event) => updateField("phone", event.target.value)} />
        <Input label="Email" name="email" type="email" autoComplete="email" placeholder="anna@example.com" value={values.email} error={errors.email} onChange={(event) => updateField("email", event.target.value)} className="sm:col-span-2" />
        <Input label="Адрес доставки" name="address" autoComplete="street-address" placeholder="Город, улица, дом, квартира" value={values.address} error={errors.address} onChange={(event) => updateField("address", event.target.value)} className="sm:col-span-2" />
      </div>
      <DeliveryOptions
        value={values.delivery}
        onChange={(delivery) => setValues((current) => ({ ...current, delivery }))}
      />
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Spinner />
            Обрабатываем оплату…
          </>
        ) : (
          "Оплатить"
        )}
      </Button>
    </form>
  );
}
