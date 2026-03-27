// React
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Components
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import FormContainer from "../components/common/Form";

// Contexts
import { useAuth } from "../context/AuthContext";

// Composant de la page d'inscription
function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Nom requis";
    }

    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Au moins 6 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
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

    setTimeout(() => {
      register(formData.name, formData.email, formData.password);
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <FormContainer title="NetZlix">
      <div className="bg-black/60 backdrop-blur-lg p-8 rounded-lg border border-gray-800">
        <h2 className="text-3xl font-bold mb-6">S'inscrire</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="name"
            name="name"
            placeholder="Nom"
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
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

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirmez le Mot de passe"
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />

          <Button type="submit" className="w-full">
            {loading ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </FormContainer>
  );
}

export default Register;
