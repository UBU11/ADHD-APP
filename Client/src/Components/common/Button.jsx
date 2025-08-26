
const Button = ({ children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        px-6
        py-3
        font-semibold
        text-white
        bg-green-600
        rounded-lg
        shadow-md
        transition-all
        duration-300
        ease-in-out
        hover:bg-green-700
        hover:-translate-y-1
        hover:shadow-lg
        active:scale-95
        active:shadow-sm
      "
    >
      {children}
    </button>
  );
};

export default Button;
