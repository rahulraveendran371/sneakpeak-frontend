import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {

  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {

    const handleUserChange = () => {

      const user = JSON.parse(localStorage.getItem("user") || "null");

      const id = user?._id || user?.id || null;

      setUserId(id);

      if (id) {
        const stored = localStorage.getItem(`cart_${id}`);
        setCart(stored ? JSON.parse(stored) : []);
      } else {
        setCart([]);
      }

    };

    handleUserChange();

    window.addEventListener("user-changed", handleUserChange);

    return () =>
      window.removeEventListener("user-changed", handleUserChange);

  }, []);

  useEffect(() => {

    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }

  }, [cart, userId]);

  const addToCart = (product) => {

    setCart((prev) => {

      const exists = prev.find((i) => i._id === product._id);

      if (exists) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }

      return [...prev, { ...product, qty: 1 }];

    });

  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, qty: i.qty + 1 } : i
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i._id === id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const clearCart = () => {

    setCart([]);

    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }

  };

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >

      {children}

    </CartContext.Provider>

  );

}