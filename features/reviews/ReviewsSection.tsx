"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { requestJson } from "@/lib/api";
import { pluralize } from "@/lib/pluralize";
import type { ReviewErrors } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import type { Review, ReviewsResponse } from "@/types";
import { ReviewForm } from "./ReviewForm";
import { StarRating } from "./StarRating";

const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

export function ReviewsSection({ setId }: { setId: string }) {
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);
  const showToast = useToastStore((state) => state.showToast);
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loadError, setLoadError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const endpoint = `/api/sets/${setId}/reviews`;

  const load = useCallback(async () => {
    const result = await requestJson<ReviewsResponse>(endpoint);
    if (result.ok) {
      setData(result.data);
      setLoadError("");
    } else {
      setLoadError(result.error);
    }
  }, [endpoint]);

  // Перезагружаем при входе и выходе: меняется пометка «ваш отзыв»
  useEffect(() => {
    void load();
  }, [load, user?.id]);

  const ownReview = data?.reviews.find((review) => review.isOwn);

  const submit = async (values: { rating: number; text: string }): Promise<ReviewErrors | null> => {
    const result = await requestJson<ReviewsResponse>(endpoint, { body: values });
    if (!result.ok) {
      if (result.status === 401) useAuthStore.getState().setUser(null);
      showToast(result.error, "error");
      return (result.fieldErrors as ReviewErrors | undefined) ?? null;
    }
    setData(result.data);
    setIsEditing(false);
    showToast(ownReview ? "Отзыв обновлён" : "Спасибо за отзыв!");
    return null;
  };

  const remove = async () => {
    if (!window.confirm("Удалить ваш отзыв?")) return;
    const result = await requestJson<ReviewsResponse>(endpoint, { method: "DELETE" });
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    setData(result.data);
    setIsEditing(false);
    showToast("Отзыв удалён", "info");
  };

  return (
    <section aria-labelledby="reviews-heading" className="mt-16 border-t border-ink/5 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="reviews-heading" className="font-serif text-3xl text-ink">
          Отзывы
        </h2>
        {data && data.summary.count > 0 && data.summary.average !== null && (
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <StarRating value={data.summary.average} />
            <span className="font-semibold text-ink">
              {data.summary.average.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}
            </span>
            <span>
              · {data.summary.count} {pluralize(data.summary.count, ["отзыв", "отзыва", "отзывов"])}
            </span>
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="order-2 lg:order-1">
          {loadError ? (
            <p className="text-sm text-ink-muted">Не удалось загрузить отзывы: {loadError}</p>
          ) : !data ? (
            <div className="flex justify-center py-8 text-ink-muted">
              <Spinner />
            </div>
          ) : data.reviews.length === 0 ? (
            <p className="rounded-card border border-dashed border-ink/15 p-6 text-center text-ink-muted">
              Отзывов пока нет — станьте первым, кто расскажет об этой атмосфере.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {data.reviews.map((review) => (
                <ReviewItem key={review.id} review={review} onEdit={() => setIsEditing(true)} onDelete={remove} />
              ))}
            </ul>
          )}
        </div>

        <div className="order-1 lg:order-2">
          {authStatus === "authenticated" ? (
            ownReview && !isEditing ? (
              <p className="rounded-card bg-linen p-5 text-sm text-ink-soft shadow-soft">
                Вы уже оставили отзыв на этот набор. Его можно изменить или удалить в списке.
              </p>
            ) : (
              <div>
                <h3 className="mb-3 font-serif text-xl text-ink">{ownReview ? "Изменить отзыв" : "Оставить отзыв"}</h3>
                <ReviewForm
                  key={ownReview?.id ?? "new"}
                  initialRating={ownReview?.rating}
                  initialText={ownReview?.text}
                  submitLabel={ownReview ? "Сохранить" : "Опубликовать"}
                  onSubmit={submit}
                  onCancel={ownReview ? () => setIsEditing(false) : undefined}
                />
              </div>
            )
          ) : authStatus === "guest" ? (
            <div className="rounded-card bg-linen p-5 text-sm text-ink-soft shadow-soft">
              <p>Отзывы могут оставлять зарегистрированные читатели.</p>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                <Link href={`/login?next=/set/${setId}`} className="font-medium text-terracotta-dark hover:underline">
                  Войти
                </Link>
                <Link href={`/register?next=/set/${setId}`} className="font-medium text-terracotta-dark hover:underline">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ReviewItem({ review, onEdit, onDelete }: { review: Review; onEdit: () => void; onDelete: () => void }) {
  const wasEdited = review.updatedAt - review.createdAt > 60_000;
  return (
    <li className="rounded-card bg-linen p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-light font-serif text-terracotta-dark">
            {review.authorName.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-medium text-ink">
              {review.authorName}
              {review.isOwn && <span className="ml-2 text-xs font-normal text-terracotta-dark">ваш отзыв</span>}
            </p>
            <p className="text-xs text-ink-muted">
              {dateFormat.format(review.createdAt)}
              {wasEdited && " · изменён"}
            </p>
          </div>
        </div>
        <StarRating value={review.rating} />
      </div>
      <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">{review.text}</p>
      {review.isOwn && (
        <div className="mt-3 flex gap-4 text-sm">
          <button type="button" onClick={onEdit} className="text-terracotta-dark hover:underline">
            Изменить
          </button>
          <button type="button" onClick={onDelete} className="text-ink-muted hover:text-terracotta-dark hover:underline">
            Удалить
          </button>
        </div>
      )}
    </li>
  );
}
