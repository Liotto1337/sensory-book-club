"use client";

import { Button } from "@/components/ui/Button";
import { BagIcon } from "@/components/ui/icons";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";

interface AddToCartButtonProps {
  setId: string;
  atmosphere: string;
}

export function AddToCartButton({ setId, atmosphere }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);

  const handleClick = () => {
    addItem(setId);
    showToast(`«${atmosphere}» добавлен в корзину`);
  };

  return (
    <Button size="lg" onClick={handleClick} className="w-full sm:w-auto">
      <BagIcon className="h-5 w-5" />
      В корзину
    </Button>
  );
}
