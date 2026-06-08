import {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const handleUserChange = () => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user") || "null"
        );

        const id = user?._id || user?.id || null;

        setUserId(id);

        if (id) {
          const stored = localStorage.getItem(`cart_${id}`);

          setCart(
            stored ? JSON.parse(stored) : []
          );
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Cart load error:", error);
        setCart([]);
      }
    };

    handleUserChange();

    window.addEventListener(
      "user-changed",
      handleUserChange
    );

    return () =>
      window.removeEventListener(
        "user-changed",
        handleUserChange
      );
  }, []);

  useEffect(() => {
    if (!userId) return;

    localStorage.setItem(
      `cart_${userId}`,
      JSON.stringify(cart)
    );
  }, [cart, userId]);

  const getProductId = (product) =>
    product?._id || product?.id;

  const addToCart = useCallback((product) => {
    const productId = getProductId(product);

    if (!productId) return;

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          getProductId(item) === productId
      );

      if (existing) {
        return prev.map((item) =>
          getProductId(item) === productId
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          qty: 1,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) =>
      prev.filter(
        (item) => getProductId(item) !== id
      )
    );
  }, []);

  const increaseQty = useCallback((id) => {
    setCart((prev) =>
      prev.map((item) =>
        getProductId(item) === id
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      )
    );
  }, []);

  const decreaseQty = useCallback((id) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (getProductId(item) !== id)
          return [item];

        if (item.qty <= 1)
          return [];

        return [
          {
            ...item,
            qty: item.qty - 1,
          },
        ];
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);

    if (userId) {
      localStorage.removeItem(
        `cart_${userId}`
      );
    }
  }, [userId]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}