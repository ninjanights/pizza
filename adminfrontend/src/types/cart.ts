import type { MenuItem } from "./menu";

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | {
      type: "ADD_TO_CART";
      payload: MenuItem;
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: string;
    }
  | {
      type: "INCREASE_QUANTITY";
      payload: string;
    }
  | {
      type: "DECREASE_QUANTITY";
      payload: string;
    }
  | {
      type: "CLEAR_CART";
    };
