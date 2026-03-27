// React
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Components
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import FormContainer from "../components/common/Form";

// Contexts
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

// Composant de la page de connexion
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const { error, success } = useNotification();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    //Connexion
    const result = await login(formData.email, formData.password);

    if (result.success) {
      success("Connexion réussie !");
      navigate("/");
    } else {
      error(result.error || "Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <FormContainer title="NetZlix">
      {/* Formulaire */}
      <div className="bg-black/60 backdrop-blur-lg p-8 rounded-lg border border-gray-800">
        <h2 className="text-3xl font-bold mb-6">Se connecter</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />

          <Input
            type="password"
            name="password"
            placeholder="Mot de passe"
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-primary hover:underline">
            S'inscrire
          </Link>
        </div>
      </div>
    </FormContainer>
  );
}

export default Login;
