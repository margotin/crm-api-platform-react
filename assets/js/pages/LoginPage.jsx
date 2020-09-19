import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

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
      console.log(history);
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
        <div className="form-group">
          <label htmlFor="username">Adresse email</label>
          <input
            type="email"
            placeholder="Adresse email de connexion"
            name="username"
            id="username"
            className={"form-control" + (error ? " is-invalid" : "")}
            value={credentials.username}
            onChange={handleChange}
          />
          <p className="invalid-feedback">{error}</p>
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            placeholder="Mot de passe de connexion"
            name="password"
            id="password"
            className="form-control"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Connexion
          </button>
        </div>
      </form>
    </>
  );
}
