// React
import { useState, useEffect } from "react";

// Components
import Navbar from "../components/common/Navbar";
import Footer from "../components/layout/Footer";
import Loading from "../components/common/Loading";
import LoadingError from "../components/common/LoadingError";

// Context
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

// Page de profil utilisateur
function Profile() {
  // State pour gérer le chargement, les erreurs, les succès, et les données utilisateur
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const { user, changePassword, updateProfile } = useAuth();
  const { success } = useNotification();

  // Effet pour charger les données du profil au montage du composant
  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  // Fonction pour récupérer les données du profil utilisateur
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      setFormData({
        name: user.name,
        email: user.email,
      });
    } catch (err) {
      setError(err.message || "Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  };

  // Handlers pour les changements de formulaire et les actions de mise à jour du profil et de changement de mot de passe
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //    Handler pour les changements de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  //    Handler pour la mise à jour du profil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const result = await updateProfile(formData);
      if (!result.success) {
        throw new Error(result.message || "Erreur lors de la mise à jour");
      }

      setEditing(false);
      success("Profil mis à jour avec succès");
    } catch (err) {
      error(err.message || "Erreur lors de la mise à jour du profil");
    }
  };

  // Handler pour le changement de mot de passe
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );
      if (!result.success) {
        throw new Error(
          result.message || "Erreur lors du changement de mot de passe",
        );
      }
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      success("Mot de passe changé avec succès");
    } catch (err) {
      error(err.message || "Erreur lors du changement de mot de passe");
    }
  };

  if (loading) return <Loading />;
  if (error) return <LoadingError fetchData={fetchUserProfile} error={error} />;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">Mon profil</h1>

        {/* Section principale avec informations personnelles et barre latérale*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Informations personnelles
                </h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-primary hover:bg-primary/80 rounded transition"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 rounded transition"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Nom</p>
                    <p className="text-lg font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-lg font-semibold">{user?.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Barre latérale */}
          <div className="space-y-6">
            {/* Changer le mot de passe */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-4">Sécurité</h3>
              {showPasswordForm ? (
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 bg-primary hover:bg-primary/80 rounded text-sm transition"
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(false)}
                      className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition text-sm"
                >
                  Changer le mot de passe
                </button>
              )}
            </div>
          </div>
        </div>


      </div>

      <Footer />
    </div>
  );
}

export default Profile;
