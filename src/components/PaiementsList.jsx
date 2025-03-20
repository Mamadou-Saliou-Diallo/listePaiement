import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx"; // 📌 Import XLSX
import { saveAs } from "file-saver"; // 📌 Import FileSaver

const PaiementsList = ({ paiements, supprimerPaiement }) => {
  // Fonction pour générer le PDF
  const telechargerPDF = () => {
    if (paiements.length === 0) {
      alert("Aucun paiement à télécharger !");
      return;
    }

    const doc = new jsPDF();
    doc.text("Liste des Paiements", 14, 10);

    const tableColumn = ["Nom", "Montant (FCFA)", "Date"];
    const tableRows = [];

    paiements.forEach((paiement) => {
      const paiementData = [paiement.nom, paiement.montant.toString(), paiement.date];
      tableRows.push(paiementData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("paiements.pdf");
  };

  // Fonction pour générer l'Excel
  const telechargerExcel = () => {
    if (paiements.length === 0) {
      alert("Aucun paiement à télécharger !");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(paiements);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Paiements");

    // Générer le fichier Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, "paiements.xlsx"); // Téléchargement du fichier
  };

  return (
    <div className="container mt-4">
      <h2>Liste des paiements</h2>
      <button className="btn btn-success mb-3 me-2" onClick={telechargerPDF}>
        Télécharger en PDF
      </button>
      <button className="btn btn-primary mb-3" onClick={telechargerExcel}>
        Télécharger en Excel
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paiements.map((paiement, index) => (
            <tr key={index}>
              <td>{paiement.nom}</td>
              <td>{paiement.montant} FCFA</td>
              <td>{paiement.date}</td>
              <td>
                <button 
                  className="btn btn-danger"
                  onClick={() => supprimerPaiement(index)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaiementsList;
