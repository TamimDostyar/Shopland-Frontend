import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCart, type Cart } from "@amazebid/shared";
import { useAuth } from "../hooks/useAuth";

export type CartContextValue = {
  cart: Cart | null;
  itemsCount: number;
  refreshCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);

  const refreshCart = useCallback(async () => {
    // Cart is buyer-only. Avoid 403 spam for seller/admin accounts.
    if (!accessToken || user?.role !== "buyer") {
      setCart(null);
      return;
    }
    try {
      const c = await getCart(accessToken);
      setCart(c);
    } catch {
      // ignore
    }
  }, [accessToken, user?.role]);

  useEffect(() => {
    if (isAuthenticated) void refreshCart();
    else setCart(null);
  }, [isAuthenticated, refreshCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemsCount: cart?.items_count ?? 0,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
