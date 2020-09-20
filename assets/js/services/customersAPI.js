import axios from "axios";

async function findAll() {
  const response = await axios.get("http://localhost:8000/api/customers");
  return response.data["hydra:member"];
}

function deleteCustomer(customerId) {
  return axios.delete("http://localhost:8000/api/customers/" + customerId);
}

async function findCustumer(customerId) {
  const response = await axios.get(
    "http://localhost:8000/api/customers/" + customerId
  );
  return response.data;
}

function updateCustomer(customerId, customer) {
  return axios.put(
    "http://localhost:8000/api/customers/" + customerId,
    customer
  );
}

function createCustomer(customer) {
  return axios.post("http://localhost:8000/api/customers", customer);
}

export default {
  findAll,
  delete: deleteCustomer,
  find: findCustumer,
  update: updateCustomer,
  create: createCustomer,
};
