import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  // Pour l'instant, on simule avec localStorage
  // plus tard on utilisera Context API
  const {isAuthenticated} = useAuth();
  
  if (!isAuthenticated()) {
    // Rediriger vers la page de connexion
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
