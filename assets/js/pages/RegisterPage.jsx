import React, { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import usersAPI from "../services/usersAPI";

export default function RegisterPage({ history }) {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  function handleChange({ currentTarget }) {
    setUser({ ...user, [currentTarget.name]: currentTarget.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm = "Les mots de passe ne sont pas identiques !";
      setErrors(apiErrors);
      return;
    }

    try {
      await usersAPI.register(user);
      setErrors({});
      history.replace("/login");
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
    }
  }

  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom"
          value={user.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="lastName"
          label="Nom"
          placeholder="Votre nom de famille"
          value={user.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="email"
          label="Adresse email"
          placeholder="Votre adresse email"
          value={user.email}
          onChange={handleChange}
          error={errors.email}
          type="email"
        />
        <Field
          name="password"
          label="Mot de passe"
          placeholder="Votre mot de passe"
          value={user.password}
          onChange={handleChange}
          error={errors.password}
          type="password"
        />
        <Field
          name="passwordConfirm"
          label="Confirmer votre mot de passe"
          placeholder="Confirmer votre mot de passe"
          value={user.passwordConfirm}
          onChange={handleChange}
          error={errors.passwordConfirm}
          type="password"
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Créer
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
}
