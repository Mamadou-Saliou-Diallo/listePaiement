import React, { useState } from "react";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

const PaiementsList = ({ paiements, supprimerPaiement }) => {
  const [titre, setTitre] = useState(""); // État pour le titre personnalisé
  
  // Calcul du total et formatage en monétaire (CFA)
  const totalMontant = paiements.reduce((acc, paiement) => acc + Number(paiement.montant), 0);
  const totalFormatted = totalMontant.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'XOF', // Utilisation de la monnaie CFA
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const telechargerPDF = () => {
    if (paiements.length === 0) {
      alert("Aucun paiement à télécharger !");
      return;
    }

    const doc = new jsPDF();
    
    // Si un titre personnalisé est fourni, l'utiliser, sinon utiliser "Liste des Paiements"
    const titreFinal = titre.trim() !== "" ? titre + " - Liste des Paiements" : "Liste des Paiements";
    doc.text(titreFinal, 14, 10); // Ajouter le titre au PDF

    const tableColumn = ["Nom", "Montant (FCFA)", "Date"];
    const tableRows = [];

    paiements.forEach((paiement) => {
      tableRows.push([paiement.nom, paiement.montant.toString(), paiement.date]);
    });

    // Ajouter la ligne du total à la tableRows
    const totalRow = ["Total", totalFormatted, ""];
    tableRows.push(totalRow);

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
          // Appliquer la couleur du texte et du fond à la cellule du total
          doc.setFillColor(200, 230, 201); // Fond vert clair
          doc.setTextColor(255, 0, 0); // Texte en rouge
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F"); // Appliquer le fond
          doc.text(data.cell.text, data.cell.x + 2, data.cell.y + 5); // Réécrire le texte en rouge
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
              <td>{paiement.montant}</td>
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
            <td colSpan="3" className="text-right font-weight-bold">Total</td>
            <td className="font-weight-bold" style={{ color: "red" }}>{totalFormatted}</td>
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
