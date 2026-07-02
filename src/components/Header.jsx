import { Link } from "react-router-dom";
import logo from "../assets/nutrafyi-logo.png";

function Header() {
  return (
    <header style={{ backgroundColor: "#faf7e5" }} className="py-4 border-b border-[#e8e4cc]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
        <Link to="/">
          <img
            src={logo}
            alt="Nutrafyi"
            className="h-14 object-contain"
          />
        </Link>
      </div>
    </header>
  );
}

export default Header;