import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SearchProvider } from "./context/SearchContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <SearchProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </SearchProvider>
  </React.StrictMode>
);