import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Categories from "./pages/Categories";
import Brands from "./pages/Brands";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Coupons from "./pages/Coupons";
import Reviews from "./pages/Reviews";
import Inventory from "./pages/Inventory";
import CMSPages from "./pages/CMSPages";
import CMSBlogs from "./pages/CMSBlogs";
import Settings from "./pages/Settings";
import Admins from "./pages/Admins";
import TrashBin from "./pages/TrashBin";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <ScrollToTop />
      {/* Toast Alert popups */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm font-semibold rounded-2xl border border-slate-100 shadow-lg",
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#1e293b",
          },
        }}
      />

      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute resource="products">
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute resource="products">
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute resource="products">
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute resource="categories">
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands"
          element={
            <ProtectedRoute resource="brands">
              <Brands />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute resource="orders">
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute resource="orders">
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute resource="users_view">
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <ProtectedRoute resource="users_view">
              <CustomerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coupons"
          element={
            <ProtectedRoute resource="coupons">
              <Coupons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute resource="reviews">
              <Reviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute resource="inventory">
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pages"
          element={
            <ProtectedRoute resource="pages">
              <CMSPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute resource="blogs">
              <CMSBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute resource="settings">
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <ProtectedRoute resource="admins">
              <Admins />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trash"
          element={
            <ProtectedRoute>
              <TrashBin />
            </ProtectedRoute>
          }
        />
        {/* Fallback to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
