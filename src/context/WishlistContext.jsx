import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const getProductId = (product) =>
    product?._id || product?.id;

  useEffect(() => {
    const handleUserChange = () => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user") || "null"
        );

        const id =
          user?._id ||
          user?.id ||
          null;

        setUserId(id);

        if (id) {
          const storedWishlist =
            localStorage.getItem(
              `wishlist_${id}`
            );

          setWishlist(
            storedWishlist
              ? JSON.parse(storedWishlist)
              : []
          );
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error(
          "Wishlist load error:",
          error
        );

        setWishlist([]);
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
      `wishlist_${userId}`,
      JSON.stringify(wishlist)
    );
  }, [wishlist, userId]);

  const addToWishlist = useCallback(
    (product) => {
      const productId =
        getProductId(product);

      if (!productId) return;

      setWishlist((prev) => {
        const exists = prev.some(
          (item) =>
            getProductId(item) === productId
        );

        if (exists) return prev;

        return [...prev, product];
      });
    },
    []
  );

  const removeFromWishlist =
    useCallback((id) => {
      setWishlist((prev) =>
        prev.filter(
          (item) =>
            getProductId(item) !== id
        )
      );
    }, []);

  const isInWishlist = useCallback(
    (id) =>
      wishlist.some(
        (item) =>
          getProductId(item) === id
      ),
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);

    if (userId) {
      localStorage.removeItem(
        `wishlist_${userId}`
      );
    }
  }, [userId]);

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    }),
    [
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );
}