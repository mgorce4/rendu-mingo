import React from "react";

const Input = ({ type, name, placeholder, handleChange, formData, errors }) => {
  return (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-primary text-white"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );
};

export default Input;
