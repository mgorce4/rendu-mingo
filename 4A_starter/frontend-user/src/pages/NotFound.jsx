import { Link } from "react-router-dom";
import Button from "../components/common/Button";

function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-4xl font-bold mb-4">Page introuvable</h2>
        <p className="text-xl text-gray-400 mb-8">
          Oups ! La page que vous recherchez n'existe pas.
        </p>
        <Link to="/">
          <Button size="lg">Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
