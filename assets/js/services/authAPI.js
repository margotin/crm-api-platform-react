import axios from "axios";
import jwtDecode from "jwt-decode";

async function authenticate(credentials) {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/login_check",
    credentials
  );
  const token = response.data.token;
  // Je stoke le token dans le localStorage
  window.localStorage.setItem("authToken", token);
  // On previent AXIOS que l'on a maintenant un header par default pour toutes nos futures requetes HTPP
  setAxiosToken(token);
}
// function authenticate(credentials) {
//   return axios
//     .post("http://127.0.0.1:8000/api/login_check", credentials)
//     .then((response) => response.data.token)
//     .then((token) => {
//       // Je stoke le token dans le localStorage
//       window.localStorage.setItem("authToken", token);
//       // On previent AXIOS que l'on a maintenant un header par default pour toutes nos futures requetes HTPP
//       axios.defaults.headers["Authorization"] = "Bearer " + token;
//       return true;
//     });
// }

function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

function setup() {
  const token = window.localStorage.getItem("authToken");

  if (token) {
    const { exp: tokenExpiration } = jwtDecode(token);
    if (tokenExpiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

function isAuthenticated() {
  const token = window.localStorage.getItem("authToken");

  if (token) {
    const { exp: tokenExpiration } = jwtDecode(token);
    if (tokenExpiration * 1000 > new Date().getTime()) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
};
