
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Category from "./pages/category";
import CategoryDetail from "./pages/CategoryDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from './pages/BlogDetail';
import Login from "./pages/Login";
import Account from "./pages/Account";
import TrackOrder from "./pages/TrackOrder";
import FAQ from "./pages/FAQ";
import ShippingInfo from "./pages/ShippingInfo";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

import Checkout from "./pages/Checkout";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

import { CurrencyProvider } from "./context/CurrencyContext";

function App() {
  return (
    <CurrencyProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>

          {/* Website Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<Category />} />
            <Route path="/category/:slug" element={<CategoryDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping-info" element={<ShippingInfo />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
          </Route>

          {/* Standalone Checkout Route to match custom layout */}
          <Route path="/checkout" element={<Checkout />} />

        </Routes>
      </BrowserRouter>
    </CurrencyProvider>
  );
}

export default App;