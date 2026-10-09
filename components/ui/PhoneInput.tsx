"use client";

import { useRef, type ChangeEvent, type ComponentProps, type FormEvent } from "react";
import {
  caretAfterNationalDigits,
  countNationalDigitsBefore,
  formatPhone,
  toNationalDigits,
} from "@/lib/phone";
import { Input } from "./Input";

type InputProps = ComponentProps<typeof Input>;

interface PhoneInputProps extends Omit<InputProps, "value" | "onChange" | "type"> {
  value: string;
  onValueChange: (value: string) => void;
}

// Набирать можно только цифры; символы маски и «+» допустимы, чтобы не мешать вставке номера целиком
const ALLOWED_TYPED = /^[\d\s()+-]*$/;

export function PhoneInput({ value, onValueChange, ...props }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBeforeInput = (event: FormEvent<HTMLInputElement>) => {
    const data = (event.nativeEvent as InputEvent).data;
    if (data && !ALLOWED_TYPED.test(data)) event.preventDefault();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const raw = input.value;
    const caret = input.selectionStart ?? raw.length;
    const inputType = (event.nativeEvent as InputEvent).inputType ?? "";

    let national = toNationalDigits(raw);
    let digitsBeforeCaret = raw.startsWith("+7")
      ? countNationalDigitsBefore(raw, caret)
      : national.length;

    // Стёрли только символ маски («)», пробел, дефис): иначе он вернётся при форматировании и курсор застрянет.
    // Удаляем соседнюю цифру в сторону стирания.
    const previousNational = toNationalDigits(value);
    if (raw.length < value.length && national === previousNational) {
      if (inputType === "deleteContentForward") {
        national = national.slice(0, digitsBeforeCaret) + national.slice(digitsBeforeCaret + 1);
      } else if (digitsBeforeCaret > 0) {
        national = national.slice(0, digitsBeforeCaret - 1) + national.slice(digitsBeforeCaret);
        digitsBeforeCaret -= 1;
      }
    }

    const formatted = formatPhone(national);
    onValueChange(formatted);

    const nextCaret = caretAfterNationalDigits(formatted, Math.min(digitsBeforeCaret, national.length));
    requestAnimationFrame(() => {
      if (document.activeElement === inputRef.current) {
        inputRef.current?.setSelectionRange(nextCaret, nextCaret);
      }
    });
  };

  return (
    <Input
      ref={inputRef}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder="+7 (900) 000-00-00"
      value={value}
      onBeforeInput={handleBeforeInput}
      onChange={handleChange}
      {...props}
    />
  );
}
