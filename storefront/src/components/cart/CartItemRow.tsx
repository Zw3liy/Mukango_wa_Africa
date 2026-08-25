import React from "react";
import { CartItem } from "../../types/commerce";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/currency";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { product, selectedFinish, quantity, customEngraving } = item;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#D4B896]/20">
      {/* Thumbnail */}
      <div className="w-20 h-20 bg-stone-100 rounded overflow-hidden shrink-0 border border-[#D4B896]/30">
        <img
          src={product.images.hero}
          alt={product.images.alt || product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-serif text-base text-[#4F2607] font-normal truncate">
            {product.name}
          </h4>
          <span className="text-sm font-medium text-[#2D2A26] shrink-0">
            {formatPrice(product.basePriceUsd * quantity)}
          </span>
        </div>

        <p className="text-xs text-[#7A6039] font-light mt-0.5">
          Finish: {selectedFinish.name}
        </p>

        {customEngraving && (
          <p className="text-[11px] text-stone-500 italic mt-0.5 truncate">
            Engraving: "{customEngraving}"
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-[#D4B896] rounded bg-white">
            <button
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="p-1.5 hover:bg-stone-100 text-stone-600 transition"
              aria-label={`Decrease quantity of ${product.name}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-medium text-[#2D2A26]">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, quantity + 1)}
              className="p-1.5 hover:bg-stone-100 text-stone-600 transition"
              aria-label={`Increase quantity of ${product.name}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeItem(item.id)}
            className="text-stone-400 hover:text-[#C02B0A] p-1 transition"
            aria-label={`Remove ${product.name} from basket`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
