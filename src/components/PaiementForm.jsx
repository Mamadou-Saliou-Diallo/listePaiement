import React, { useState } from "react";

const PaiementForm = ({ ajouterPaiement }) => {
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom || !montant || !date) return;

    ajouterPaiement({ nom, montant, date });
    setNom("");
    setMontant("");
    setDate("");
  };

  return (
    <div className="container mt-4">
    
      
    </div>
  );
};

export default PaiementForm;
