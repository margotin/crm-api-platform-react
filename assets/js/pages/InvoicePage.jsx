import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";

export default function InvoicePage({ history, match }) {
  const { id = "new" } = match.params;
  const template = { amount: "", customer: "", status: "" };

  const [invoice, setInvoice] = useState({ ...template, status: "SENT" });
  const [errors, setErrors] = useState(template);
  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);

  async function fetchCustomers() {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) {
        setInvoice({ ...invoice, customer: data[0].id });
      }
    } catch (error) {
      history.replace("/invoices");
    }
  }

  async function fetchInvoice(invoiceId) {
    try {
      const { amount, status, customer } = await InvoicesAPI.find(invoiceId);
      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      history.replace("/invoices");
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  function handleChange({ currentTarget }) {
    setInvoice({ ...invoice, [currentTarget.name]: currentTarget.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (editing) {
        await InvoicesAPI.update(id, invoice);
        setErrors(template);
      } else {
        await InvoicesAPI.create(invoice);
        setErrors(template);
        history.replace("/invoices");
      }
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
    }
  }

  return (
    <>
      {editing ? (
        <h1>Modification d'une facture</h1>
      ) : (
        <h1>Création d'une facture</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          label="Montant"
          placeholder="Montant de la facture"
          value={invoice.amount}
          onChange={handleChange}
          error={errors.amount}
        />

        <Select
          name="customer"
          label="client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>

        <Select
          name="status"
          label="statut"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
}
