import React from "react";
import { Link } from "react-router-dom";

// Components
import Navbar from "./Navbar";
import Loading from "./Loading";
import LoadingError from "./LoadingError";
import Button from "./Button";
import Footer from "../layout/Footer";

const Template = ({
  title,
  error,
  loading,
  fetchData,
  data,
  emptyMessage = "Pas de données à afficher :-(",
  summary = false,
  children,
}) => {
  // État de chargement
  if (loading) return <Loading />;

  // État d'erreur
  if (error) return <LoadingError fetchData={fetchData} error={error} />;

  const partialSummary = summary || "resulstat%";
  const displaySummary = partialSummary.replaceAll(
    "%",
    data.length > 1 ? "s" : "",
  );
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="container mx-auto py-24 px-4 min-h-100">
        {/* Message si aucune donnée */}
        {data.length === 0 ? (
          <div className="text-center ">
            <svg
              className="w-24 h-24 mx-auto mb-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <p className="text-2xl text-gray-400 mb-6">{emptyMessage}</p>
            <Link to="/">
              <Button>Découvrir des films</Button>
            </Link>
          </div>
        ) : (
          <div className="container mx-auto px-4 ">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">{title}</h1>
            <p className="text-gray-400 mb-8 text-sm">
              {data &&
                `${data.length} ${displaySummary}`}
            </p>
            {children}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Template;
