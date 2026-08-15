import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";

import { cartReducer, initialCartState } from "../reducers/cartReducers";

import type { MenuItem } from "../types/menu";
import type { CartState } from "../types/cart";

type CartContextType = {
  cart: CartState;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    initialCartState
  );

  function addToCart(item: MenuItem) {
    dispatch({
      type: "ADD_TO_CART",
      payload: item,
    });
  }

  function removeFromCart(itemId: string) {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: itemId,
    });
  }

  function increaseQuantity(itemId: string) {
    dispatch({
      type: "INCREASE_QUANTITY",
      payload: itemId,
    });
  }

  function decreaseQuantity(itemId: string) {
    dispatch({
      type: "DECREASE_QUANTITY",
      payload: itemId,
    });
  }

  function clearCart() {
    dispatch({
      type: "CLEAR_CART",
    });
  }

  const totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.items.reduce(
    (total, item) =>
      total + Number(item.menuItem.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}