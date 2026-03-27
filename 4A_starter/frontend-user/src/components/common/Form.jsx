import { Link, useNavigate } from "react-router-dom";

const FormContainer = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-6xl font-bold text-primary"> {title}</h1>
        </Link>

        {/* Formulaire */}
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
