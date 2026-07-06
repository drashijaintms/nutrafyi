import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { currency, currencies, changeCurrency } = useCurrency();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Energy & Performance", path: "/category/energy-performance" },
    { name: "Vitamins & Nutrition", path: "/category/vitamins-nutrition" },
    { name: "Skin & Beauty", path: "/category/beauty-skin" },
    { name: "Weight Management", path: "/category/weight-management" },
    { name: "Immune Support", path: "/category/immune-support" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-[#1a6b35] relative z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">

          {/* Hamburger for mobile */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop nav links - centered */}
          <ul className="hidden md:flex flex-1 justify-center items-center gap-x-3.5 lg:gap-x-5 xl:gap-x-6" style={{ fontFamily: "'Taviraj', serif" }}>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`text-[13.5px] font-medium transition-colors whitespace-nowrap ${
                    isActive(item.path)
                      ? "text-white border-b-2 border-white pb-0.5"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Currency Dropdown */}
          <div className="flex items-center">
            <select
              value={currency}
              onChange={(e) => changeCurrency(e.target.value)}
              className="bg-[#155c2c] hover:bg-[#0f4a23] transition-colors text-white text-xs px-2.5 py-1.5 rounded-md border border-white/20 focus:outline-none cursor-pointer font-semibold"
            >
              {Object.values(currencies).map((cur) => (
                <option key={cur.code} value={cur.code} className="text-slate-800 bg-white">
                  {cur.flag} {cur.code} ({cur.symbol})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#155c2c] border-t border-white/10">
          <ul className="flex flex-col py-2" style={{ fontFamily: "'Taviraj', serif" }}>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-5 py-3 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-white bg-white/10"
                      : "text-white/85 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;