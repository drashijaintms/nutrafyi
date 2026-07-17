import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import { Menu, X } from "lucide-react";
import logo from "../assets/footer-logo.png";

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
    <nav className="bg-[#1a6b35] relative z-50 py-1">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Left side: Hamburger and Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile/tablet */}
            <button
              className="lg:hidden text-white p-1 hover:bg-white/10 rounded-md transition"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="flex items-center select-none py-1">
              <img
                src={logo}
                alt="Nutrafyi"
                className="h-10 md:h-12 object-contain"
              />
            </Link>
          </div>

          {/* Desktop nav links - centered */}
          <ul className="hidden lg:flex flex-1 justify-center items-center gap-x-2.5 xl:gap-x-4" style={{ fontFamily: "'Taviraj', serif" }}>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`text-[13px] xl:text-[14px] font-medium transition-colors whitespace-nowrap ${
                    isActive(item.path)
                      ? "text-white border-b-2 border-white pb-0.5 font-bold"
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

      {/* Mobile/Tablet menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#155c2c] border-t border-white/10">
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