
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import Categories from "./pages/admin/Categories";
import AddCategory from "./pages/admin/AddCategory";
import EditCategory from "./pages/admin/EditCategory";
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
function App() {
  return (
    <BrowserRouter>
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
    </Route>

    {/* Admin Routes */}
    <Route element={<AdminLayout />}>
  <Route path="/admin" element={<Dashboard />} />
  <Route path="/admin/products" element={<AdminProducts />}/>
  <Route path="/admin/products/add" element={<AddProduct />}/>
  <Route path="/admin/categories" element={<Categories />}/>
  <Route path="/admin/categories/add" element={<AddCategory />} />
  <Route path="/admin/categories/edit/:id" element={<EditCategory />}/>
</Route>

  </Routes>
</BrowserRouter>
  );
}

export default App;