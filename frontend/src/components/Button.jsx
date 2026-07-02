function Button({ children, onClick, variant = "primary" }) {
  const baseStyle =
    "px-6 py-3 rounded-lg font-semibold transition";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;