import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SearchProvider } from "./context/SearchContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* 🔑 Provider wrapper that remounts on user change */
function ProvidersWrapper({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || "guest";

  return (
    <SearchProvider>
      <CartProvider key={`cart-${userId}`}>
        <WishlistProvider key={`wishlist-${userId}`}>
          {children}
        </WishlistProvider>
      </CartProvider>
    </SearchProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProvidersWrapper>
      <App />

      {/* 🔔 Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </ProvidersWrapper>
  </React.StrictMode>
);
