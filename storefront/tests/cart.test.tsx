import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CartProvider, useCart } from "../src/context/CartContext";
import { PRODUCTS } from "../src/data/products";
import { WOOD_FINISHES } from "../src/data/timbers";

const TestCartComponent: React.FC = () => {
  const { items, totalItemsCount, subtotalUsd, addItem, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div>
      <div data-testid="items-count">{totalItemsCount}</div>
      <div data-testid="subtotal">{subtotalUsd}</div>
      <button
        onClick={() => addItem(PRODUCTS[0], 1, WOOD_FINISHES[0], "Dedication")}
        data-testid="add-item-btn"
      >
        Add Item
      </button>
      <button onClick={() => clearCart()} data-testid="clear-cart-btn">
        Clear Cart
      </button>

      <ul>
        {items.map((item) => (
          <li key={item.id} data-testid={`item-${item.id}`}>
            <span>{item.product.name}</span>
            <span data-testid={`qty-${item.id}`}>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              data-testid={`inc-${item.id}`}
            >
              +
            </button>
            <button
              onClick={() => removeItem(item.id)}
              data-testid={`rem-${item.id}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

describe("Cart State Management & Client Interactions", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds items, computes quantities and subtotal", async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    expect(screen.getByTestId("items-count").textContent).toBe("0");

    await user.click(screen.getByTestId("add-item-btn"));
    expect(screen.getByTestId("items-count").textContent).toBe("1");
    expect(screen.getByTestId("subtotal").textContent).toBe(PRODUCTS[0].basePriceUsd.toString());

    // Add again -> increment quantity
    await user.click(screen.getByTestId("add-item-btn"));
    expect(screen.getByTestId("items-count").textContent).toBe("2");
    expect(screen.getByTestId("subtotal").textContent).toBe((PRODUCTS[0].basePriceUsd * 2).toString());
  });

  it("removes items and clears cart", async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    await user.click(screen.getByTestId("add-item-btn"));
    const removeBtn = screen.getByTestId(`rem-${PRODUCTS[0].id}-${WOOD_FINISHES[0].id}`);
    await user.click(removeBtn);

    expect(screen.getByTestId("items-count").textContent).toBe("0");
  });
});
