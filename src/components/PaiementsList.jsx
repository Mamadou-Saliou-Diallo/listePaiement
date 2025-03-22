import React, { useState } from "react";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

const PaiementsList = () => {
  const [paiements, setPaiements] = useState([]);
  const [titre, setTitre] = useState(""); // État pour le titre personnalisé
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState("");

  // Calcul du total et formatage en monétaire (CFA)
  const totalMontant = paiements.reduce((acc, paiement) => acc + parseFloat(paiement.montant || 0), 0);
  const totalFormatted = `${totalMontant.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} FCFA`;

  const ajouterPaiement = () => {
    if (!nom || !montant || !date) {
      alert("Tous les champs doivent être remplis !");
      return;
    }

    const paiement = { nom, montant, date };
    setPaiements([...paiements, paiement]);

    // Réinitialiser les champs après l'ajout
    setNom("");
    setMontant("");
    setDate("");
  };

  const supprimerPaiement = (paiementASupprimer) => {
    setPaiements(paiements.filter((paiement) => paiement !== paiementASupprimer));
  };

  const telechargerPDF = () => {
    if (paiements.length === 0) {
      alert("Aucun paiement à télécharger !");
      return;
    }

    const doc = new jsPDF();

    // Si un titre personnalisé est fourni, on l'ajoute devant "Liste des Paiements"
    const titreFinal = titre.trim() !== "" ? `${titre} - Liste des Paiements` : "Liste des Paiements";
    doc.setFontSize(16);
    doc.text(titreFinal, 14, 10);

    const tableColumn = ["Nom", "Montant (FCFA)", "Date"];
    const tableRows = [];

    paiements.forEach((paiement) => {
      tableRows.push([paiement.nom, paiement.montant.toLocaleString('fr-FR'), paiement.date]);
    });

    // Ajouter la ligne du total à la tableRows
    tableRows.push(["Total", totalFormatted, ""]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 12 },
      columnStyles: {
        1: { fontStyle: "bold" },
      },
      didDrawCell: (data) => {
        if (data.row.index === tableRows.length - 1) {
          doc.setFillColor(200, 230, 201); // Fond vert clair pour la ligne du total
          doc.setTextColor(255, 0, 0); // Texte en rouge
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F");
          doc.text(data.cell.text, data.cell.x + 2, data.cell.y + 5);
          doc.setTextColor(0, 0, 0); // Réinitialiser la couleur du texte
        }
      },
    });

    doc.save("paiements.pdf");
  };

  return (
    <div>
      <h2>Liste des Paiements</h2>

      {/* Champ de saisie pour le titre personnalisé */}
      <div>
        <label htmlFor="titre">Titre personnalisé : </label>
        <input
          type="text"
          id="titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Entrez un titre pour le PDF"
        />
      </div>

      {/* Formulaire d'ajout de paiement */}
      <div>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <input
          type="number"
          placeholder="Montant (FCFA)"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="btn btn-primary" onClick={ajouterPaiement}>
          Ajouter
        </button>
      </div>

      {/* Tableau des paiements */}
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Nom</th>
            <th>Montant (FCFA)</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paiements.map((paiement, index) => (
            <tr key={index}>
              <td>{paiement.nom}</td>
              <td>{parseFloat(paiement.montant).toLocaleString('fr-FR')} FCFA</td>
              <td>{paiement.date}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => supprimerPaiement(paiement)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="2" className="text-right font-weight-bold">Total</td>
            <td className="font-weight-bold" style={{ color: "red" }}>{totalFormatted}</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <button className="btn btn-primary" onClick={telechargerPDF}>
        Télécharger PDF
      </button>
    </div>
  );
};

export default PaiementsList;
