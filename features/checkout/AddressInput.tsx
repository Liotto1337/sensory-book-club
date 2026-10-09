"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import type { AddressSuggestion } from "@/types";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 3;

interface AddressInputProps {
  value: string;
  error?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function AddressInput({ value, error, onValueChange, className }: AddressInputProps) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // Запрос уходит только после ввода пользователем, а не когда значение подставили из подсказки
  const [query, setQuery] = useState<string | null>(null);
  // Сервер ответил 503 (нет DADATA_API_KEY) — больше не спрашиваем, поле работает как обычное
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (query === null || isDisabled) return;
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch("/api/address/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });
        if (response.status === 503) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Подсказки адреса отключены: на сервере не задан DADATA_API_KEY (.env.local)");
          }
          setIsDisabled(true);
          return;
        }
        if (!response.ok) return;
        const data = (await response.json()) as { suggestions: AddressSuggestion[] };
        setSuggestions(data.suggestions);
        setActiveIndex(-1);
        setIsOpen(data.suggestions.length > 0);
      } catch {
        // Отменённый или упавший запрос: адрес можно дописать вручную
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isDisabled]);

  const select = (suggestion: AddressSuggestion) => {
    // Выбрали улицу или город без дома — дописываем запятую и ждём номер дома.
    // Сразу не перезапрашиваем: DaData подсказывает дома только после первого символа номера.
    onValueChange(suggestion.hasHouse ? suggestion.value : `${suggestion.value}, `);
    setQuery(null);
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      select(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const showList = isOpen && suggestions.length > 0 && !isDisabled;

  return (
    <div className={cn("relative", className)}>
      <Input
        ref={inputRef}
        label="Адрес доставки"
        name="address"
        autoComplete={isDisabled ? "street-address" : "off"}
        placeholder="Город, улица, дом, квартира"
        value={value}
        error={error}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-activedescendant={showList && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        onChange={(event) => {
          onValueChange(event.target.value);
          setQuery(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      <ul
        id={listboxId}
        role="listbox"
        aria-label="Подсказки адреса"
        hidden={!showList}
        className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-control border border-ink/10 bg-linen py-1 shadow-lifted"
      >
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.value}
            id={`${listboxId}-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            // mousedown, а не click: иначе blur поля закроет список раньше, чем выбор сработает
            onMouseDown={(event) => {
              event.preventDefault();
              select(suggestion);
            }}
            onMouseEnter={() => setActiveIndex(index)}
            className={cn(
              "cursor-pointer px-4 py-2.5 text-sm text-ink-soft",
              index === activeIndex && "bg-sand text-ink",
            )}
          >
            {suggestion.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
