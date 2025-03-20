import React, { useState, useEffect } from "react";
import PaiementsList from "./components/PaiementsList";
import PaiementForm from "./components/PaiementForm";

const App = () => {
  const [paiements, setPaiements] = useState([]);

  // Charger les paiements depuis localStorage
  useEffect(() => {
    const paiementsStockes = JSON.parse(localStorage.getItem("paiements")) || [];
    setPaiements(paiementsStockes);
  }, []);

  // Ajouter un paiement et sauvegarder
  const ajouterPaiement = (paiement) => {
    const nouveauxPaiements = [...paiements, paiement];
    setPaiements(nouveauxPaiements);
    localStorage.setItem("paiements", JSON.stringify(nouveauxPaiements));
  };

  // Supprimer un paiement et sauvegarder
  const supprimerPaiement = (index) => {
    const paiementsFiltres = paiements.filter((_, i) => i !== index);
    setPaiements(paiementsFiltres);
    localStorage.setItem("paiements", JSON.stringify(paiementsFiltres));
  };

  return (
    <div>
      <h1 className="text-center mt-4">Gestion des paiements</h1>
      <PaiementForm ajouterPaiement={ajouterPaiement} />
      <PaiementsList paiements={paiements} supprimerPaiement={supprimerPaiement} />
    </div>
  );
};

export default App;
