import React from "react";

const Avatar = ({ className, src, alt = "John Doe" }) => {
  return (
      <img
        src={
          src ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=e50914&color=fff`
        }
        alt={alt}
        className={`${className || ""}`}
      />
  );
};

export default Avatar;
