import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import CustomersAPI from "../services/customersAPI";

export default function CustomerPage({ match, history }) {
  const { id = "new" } = match.params;
  const template = { lastName: "", firstName: "", email: "", company: "" };

  const [customer, setCustomer] = useState(template);
  const [errors, setErrors] = useState(template);
  const [editing, setEditing] = useState(false);

  // Récupération du customer en fonction de l'identifiant
  async function fetchCustomers(customerId) {
    try {
      const { lastName, firstName, email, company } = await CustomersAPI.find(
        customerId
      );
      setCustomer({ lastName, firstName, email, company });
    } catch (error) {
      history.replace("/customers");
    }
  }

  // Chargement du customer si besoin au Chargement du composant ou au changement de l'identifiant
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomers(id);
    }
  }, [id]);

  function handleChange({ currentTarget }) {
    setCustomer({ ...customer, [currentTarget.name]: currentTarget.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (editing) {
        await CustomersAPI.update(id, customer);
      } else {
        await CustomersAPI.create(customer);
        history.replace("/customers");
      }
      setErrors(template);
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
        <h1>Modification d'un client</h1>
      ) : (
        <h1>Création d'un client</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Prénom du client"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Adresse email du client"
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
}
