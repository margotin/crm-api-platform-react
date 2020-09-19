import axios from "axios";

async function findAll() {
  return await axios
    .get("http://127.0.0.1:8000/api/customers")
    .then((response) => response.data["hydra:member"]);
}

function deleteCustomer(customerId) {
  return axios.delete("http://127.0.0.1:8000/api/customers/" + customerId);
}

export default {
  findAll,
  delete: deleteCustomer,
};
