import { useEffect, useState } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = ["Home", "About", "Services", "Contact"];

  return (
    <header
      className={`
        fixed
        top-0
        w-full
        z-50
        transition-all
        duration-300
        ease-in-out
        ${scrolled ? "bg-white/80 backdrop-blur-sm shadow-md" : "bg-transparent"}
      `}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold text-gray-800">
          <a href="#">X</a>
        </div>
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="
                relative
                text-gray-600
                font-medium
                group
              "
            >
              {link}
              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  w-full
                  h-0.5
                  bg-indigo-600
                  transform
                  scale-x-0
                  group-hover:scale-x-100
                  transition-transform
                  duration-300
                  ease-in-out
                "
              ></span>
            </a>
          ))}
        </nav>

        <div className="md:hidden">
          <button className="text-gray-800">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
