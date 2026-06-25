import { Link } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

function Navbar() {
  const { currency, currencies, changeCurrency } = useCurrency();
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Female Health", path: "/female-health" },
    { name: "Men's Health & Energy", path: "/mens-health-energy" },
    { name: "Skin & Beauty", path: "/skin-beauty" },
    { name: "Weight Loss", path: "/weight-loss" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-[#0f7b36] py-3.5">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Left spacing to balance right dropdown */}
        <div className="w-32 hidden md:block"></div>

        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-white">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="hover:text-gray-200 transition text-sm font-medium"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Currency Dropdown */}
        <div className="flex items-center gap-1.5">
          <select
            value={currency}
            onChange={(e) => changeCurrency(e.target.value)}
            className="bg-[#0b5c28] hover:bg-[#084920] transition-colors text-white text-xs px-2.5 py-1.5 rounded-lg border border-[#1b8c3d] focus:outline-hidden cursor-pointer font-semibold shadow-xs"
          >
            {Object.values(currencies).map((cur) => (
              <option key={cur.code} value={cur.code} className="text-slate-800 bg-white">
                {cur.flag} {cur.code} ({cur.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;