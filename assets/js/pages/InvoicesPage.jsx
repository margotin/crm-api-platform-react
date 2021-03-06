import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "primary",
  CANCELLED: "danger",
};

const STATUS_LABELS = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCELLED: "Annulée",
};

export default function InvoicesPage(props) {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchInvoices() {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures");
    }
  }

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Gestion du changement de page
  function handlePageChange(page) {
    setCurrentPage(page);
  }

  // Gestion de la recherche
  function handleSearch({ currentTarget }) {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  }

  /** Gestion de la suppression d'un client */
  async function handleDelete(invoiceId) {
    const orginalInvoices = [...invoices];

    setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId));
    try {
      await InvoicesAPI.delete(invoiceId);
      toast.success("La facture a bien été supprimée !");
    } catch (error) {
      toast.error("Une erreur est survenue !");
      setInvoices(orginalInvoices);
    }
  }

  // Filtrage des clients en fonction de la recherche
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.amount.toString().startsWith(search.toLowerCase())
  );

  const itemsPerPage = 10;

  //Pagination des données
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  function formatDate(str) {
    return moment(str).format("DD/MM/YYYY");
  }

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link to="/invoices/new" className="btn btn-primary">
          Créer une facture
        </Link>
      </div>
      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          className="form-control"
          value={search}
          placeholder="Rechercher ..."
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                  <Link to={"/customers/" + invoice.customer.id}>
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </Link>
                </td>
                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                <td className="text-center">
                  <span
                    className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                  >
                    {STATUS_LABELS[invoice.status]}
                  </span>
                </td>
                <td className="text-center">
                  {invoice.amount.toLocaleString()} €
                </td>
                <td>
                  <Link
                    to={"/invoices/" + invoice.id}
                    className="btn-sm btn-primary mr-1"
                  >
                    Editer
                  </Link>
                  <button
                    className="btn-sm btn-danger"
                    onClick={() => handleDelete(invoice.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {loading && <TableLoader />}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={filteredInvoices.length}
        onPageChanged={handlePageChange}
      />
    </>
  );
}
