import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import AuthContext from "../contexts/AuthContext";
import AuthAPI from "../services/authAPI";

export default function LoginPage({ history }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { setIsAuthenticated } = useContext(AuthContext);

  const [error, setError] = useState("");

  function handleChange({ currentTarget }) {
    // const newCredentials = { ...credentials };
    // newCredentials[currentTarget.name] = currentTarget.value;
    // setCredentials(newCredentials);

    setCredentials({
      ...credentials,
      [currentTarget.name]: currentTarget.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      toast.success("Authentification réussie !")
      history.replace("/customers");
    } catch (error) {
      setError(
        "Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas"
      );
    }
  }

  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit}>
        <Field
          name="username"
          label="Adresse email"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Adresse email de connexion"
          type="email"
          error={error}
        />

        <Field
          name="password"
          label="Mot de passe"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Mot de passe de connexion"
          type="password"
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Connexion
          </button>
        </div>
      </form>
    </>
  );
}
