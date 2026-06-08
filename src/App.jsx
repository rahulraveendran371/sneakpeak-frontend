import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

/* USER PAGES */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";

/* ROUTES */
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

/* ADMIN */
import AdminRoute from "./admin/routes/AdminRoute";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminUsers from "./admin/pages/AdminUsers";
import EditProduct from "./admin/pages/EditProduct";
import AddProduct from "./admin/pages/AddProduct";
import UserDetails from "./admin/pages/UserDetails";
import AdminOrders from "./admin/pages/AdminOrders";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />

        {/* GUEST ONLY ROUTES */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* PROTECTED USER ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

       

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        pauseOnFocusLoss={false}
        newestOnTop
        limit={3}
      />
    </BrowserRouter>
  );
}