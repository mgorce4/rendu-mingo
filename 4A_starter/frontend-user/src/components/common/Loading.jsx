import React from "react";

const Loading = ({ message = "Chargement..." }) => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-xl">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
