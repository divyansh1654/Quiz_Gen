import React from "react";

const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition duration-200 bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
