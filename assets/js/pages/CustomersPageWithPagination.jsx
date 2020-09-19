import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

export default function CustomersPageWithPagination(props) {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/customers?pagination=true&itemsPerPage=${itemsPerPage}&page=${currentPage}`
      )
      .then((response) => {
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
        setLoading(false);
      })
      .catch((error) => console.log(error.response));
  }, [currentPage]);

  function handleDelete(customerId) {
    const orginalCustomers = [...customers];

    setCustomers(customers.filter((customer) => customer.id !== customerId));

    axios
      .delete("http://127.0.0.1:8000/api/customers/" + customerId)
      .then((response) => console.log("OK"))
      .catch((error) => {
        setCustomers(orginalCustomers);
        console.log(error.response);
      });
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    setLoading(true);
  }

  /*const paginatedCustomers = Pagination.getData(
    customers,
    currentPage,
    itemsPerPage
  );*/

  return (
    <>
      <h1>Liste des clients (pagination)</h1>

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
        <tbody>
          {loading && (
            <tr>
              <td>Chargement ...</td>
            </tr>
          )}
          {!loading &&
            customers.map((customer) => (
              <tr className="table-light" key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <a href="#">
                    {customer.firstName} {customer.lastName}
                  </a>
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
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
    </>
  );
}
