import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";

export default function CustomersPage(props) {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /** Récupération des clients */
  async function fetchCustomers() {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Impossible de charger les clients");
    }
  }

  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  /** Gestion de la suppression d'un client */
  async function handleDelete(customerId) {
    const orginalCustomers = [...customers];

    setCustomers(customers.filter((customer) => customer.id !== customerId));
    try {
      await CustomersAPI.delete(customerId);
      toast.success("Le client a bien été supprimé !");
    } catch (error) {
      toast.error("Une erreur est survenue !");
      setCustomers(orginalCustomers);
    }
  }
  // Gestion du changement de page
  function handlePageChange(page) {
    setCurrentPage(page);
  }

  // Gestion de la recherche
  function handleSearch({ currentTarget }) {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  }

  const itemsPerPage = 10;

  // Filtrage des clients en fonction de la recherche
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase())
  );

  //Pagination des données
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
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
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th />
          </tr>
        </thead>
        {!loading && <tbody>
          {paginatedCustomers.map((customer) => (
            <tr className="table-light" key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <Link to={"/customers/"+customer.id}>
                  {customer.firstName} {customer.lastName}
                </Link>
              </td>
              <td>{customer.email}</td>
              <td>{customer.company}</td>
              <td className="text-center">
                <span className="badge badge-info">
                  {customer.invoices.length}
                </span>
              </td>
              <td className="text-center">
                {customer.totalAmount.toLocaleString()} €
              </td>
              <td>
                <button
                  onClick={() => handleDelete(customer.id)}
                  disabled={customer.invoices.length > 0}
                  className="btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>}
      </table>
      {loading && <TableLoader />}

      {filteredCustomers.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
}
