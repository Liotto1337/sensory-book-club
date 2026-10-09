export type PlaceTag = "sea" | "forest" | "home" | "cafe";
export type ScentTag = "salt_wood" | "pine_rain" | "coffee_paper" | "strawberry_grass";
export type SeasonTag = "summer" | "autumn" | "winter" | "spring";
export type TimeTag = "evening" | "morning" | "day";
export type SoundTag = "waves" | "silence" | "voices" | "music";
export type FeelingTag = "calm" | "lightness" | "sadness" | "inspiration";

export type SensoryTag = PlaceTag | ScentTag | SeasonTag | TimeTag | SoundTag | FeelingTag;

export type CatalogFilterTag = PlaceTag | SeasonTag;

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  annotation: string;
  tags: SensoryTag[];
}

export interface SensorySet {
  id: string;
  atmosphere: string;
  bookId: string;
  description: string;
  scent: string;
  sound: string;
  feeling: string;
  tactile: string;
  instructionCard: string;
  playlist: string;
  playlistTitle: string;
  price: number;
  tags: SensoryTag[];
  gradient: string;
  image: SetImage;
}

export interface SetImage {
  src: string;
  alt: string;
  author: string;
  sourceUrl: string;
}

export interface SetWithBook extends SensorySet {
  book: Book;
}

export type QuestionId = "place" | "scent" | "season" | "sound" | "feeling";

export interface AnswerOption {
  id: string;
  label: string;
  hint: string;
  emoji: string;
  tags: SensoryTag[];
}

export interface Question {
  id: QuestionId;
  title: string;
  subtitle: string;
  options: AnswerOption[];
}

export type TestAnswers = Partial<Record<QuestionId, string>>;

export interface CartItem {
  setId: string;
  quantity: number;
}

export type DeliveryMethod = "cdek" | "post" | "courier";

export interface DeliveryOption {
  id: DeliveryMethod;
  label: string;
  hint: string;
}

export interface CheckoutFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  delivery: DeliveryMethod;
}

export type CheckoutTextField = Exclude<keyof CheckoutFormValues, "delivery">;

export type CheckoutErrors = Partial<Record<CheckoutTextField, string>>;

export type ToastVariant = "success" | "info" | "error";

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
}

export interface Review {
  id: number;
  rating: number;
  text: string;
  createdAt: number;
  updatedAt: number;
  authorName: string;
  isOwn: boolean;
}

export interface ReviewsSummary {
  count: number;
  average: number | null;
}

export interface ReviewsResponse {
  reviews: Review[];
  summary: ReviewsSummary;
}

export interface AddressSuggestion {
  value: string;
  hasHouse: boolean;
}
