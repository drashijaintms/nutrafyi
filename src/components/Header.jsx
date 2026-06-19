import logo from "../assets/nutrafyi-logo.png";

function Header() {
  return (
    <header className="bg-[#edeadf] py-6">
      <div className="container mx-auto text-center">
        <img
          src={logo}
          alt="Nutrafyi"
          className="mx-auto h-16"
        />
      </div>
    </header>
  );
}

export default Header;