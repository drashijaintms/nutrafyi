import { Link } from "react-router-dom";

function Navbar() {
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
    <nav className="bg-[#0f7b36]">
      <div className="container mx-auto">
        <ul className="flex justify-center gap-10 py-4 text-white">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="hover:text-gray-200 transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;