import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {

  const [userId, setUserId] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {

    const handleUserChange = () => {

      const user = JSON.parse(localStorage.getItem("user") || "null");

      const id = user?._id || null;

      setUserId(id);

      if (id) {

        const storedWishlist = localStorage.getItem(`wishlist_${id}`);

        setWishlist(storedWishlist ? JSON.parse(storedWishlist) : []);

      } else {

        setWishlist([]);

      }

    };

    handleUserChange();

    window.addEventListener("user-changed", handleUserChange);

    return () =>
      window.removeEventListener("user-changed", handleUserChange);

  }, []);

  useEffect(() => {

    if (!userId) return;

    localStorage.setItem(
      `wishlist_${userId}`,
      JSON.stringify(wishlist)
    );

  }, [wishlist, userId]);

  const addToWishlist = (product) => {

    setWishlist((prev) => {

      if (prev.some((item) => item._id === product._id)) {
        return prev;
      }

      return [...prev, product];

    });

  };

  const removeFromWishlist = (id) => {

    setWishlist((prev) =>
      prev.filter((item) => item._id !== id)
    );

  };

  const isInWishlist = (id) => {

    return wishlist.some((item) => item._id === id);

  };

  const clearWishlist = () => {

    setWishlist([]);

    if (userId) {
      localStorage.removeItem(`wishlist_${userId}`);
    }

  };

  return (

    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >

      {children}

    </WishlistContext.Provider>

  );

}