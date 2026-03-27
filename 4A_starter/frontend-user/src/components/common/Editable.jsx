import React from "react";

// Components
import EditIcon from "./EditIcon";
import SaveIcon from "./SaveIcon";
import CancelIcon from "./CancelIcon";

// Composant pour afficher les icônes d'édition, de sauvegarde et d'annulation
const Editable = ({ isEditing, toggleEdit, validateEdit }) => {
  return (
    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-400">
      {isEditing ? (
        <div className="editing">
          <SaveIcon handleSave={validateEdit} />
          <CancelIcon handleCancel={toggleEdit} />
        </div>
      ) : (
        <EditIcon handleEdit={toggleEdit} />
      )}
    </div>
  );
};

export default Editable;
