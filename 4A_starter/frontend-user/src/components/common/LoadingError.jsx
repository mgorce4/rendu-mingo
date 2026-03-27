import React from "react";

import Navbar from "./Navbar";
import Button from "./Button";
import Footer from "../layout/Footer";

const LoadingError = ({ error, fetchData }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Erreur</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button onClick={fetchData}>Réessayer</Button>
      </div>
      <Footer />
    </div>
  );
};

export default LoadingError;
