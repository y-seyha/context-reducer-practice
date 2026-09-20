import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type CartState = CartItem[];

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "UPDATE_QUANTITY"; id: number; quantity: number };

type CartContextValue = {
  items: CartState;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  itemCount: number;
  total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.find((item) => item.id === action.item.id);

      if (existingItem) {
        return state.map((item) =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + action.item.quantity }
            : item,
        );
      }

      return [...state, action.item];
    }
    case "REMOVE_ITEM": {
      return state.filter((item) => item.id !== action.id);
    }
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return state.filter((item) => item.id !== action.id);
      }

      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item,
      );
    }
    default:
      return state;
  }
}

export function CartProvider({ children }: PropsWithChildren) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({
      type: "ADD_ITEM",
      item: { ...item, quantity: 1 },
    });
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", id, quantity });
  };

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, itemCount, total }),
    [items, itemCount, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
