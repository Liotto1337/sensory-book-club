"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Spinner } from "@/components/ui/Spinner";
import { generateOrderNumber } from "@/lib/generateOrderNumber";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { CheckoutErrors, CheckoutFormValues, CheckoutTextField } from "@/types";
import { AddressInput } from "./AddressInput";
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
        <PhoneInput label="Телефон" name="phone" value={values.phone} error={errors.phone} onValueChange={(phone) => updateField("phone", phone)} />
        <Input label="Email" name="email" type="email" autoComplete="email" placeholder="anna@example.com" value={values.email} error={errors.email} onChange={(event) => updateField("email", event.target.value)} className="sm:col-span-2" />
        <AddressInput value={values.address} error={errors.address} onValueChange={(address) => updateField("address", address)} className="sm:col-span-2" />
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
