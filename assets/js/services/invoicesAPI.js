import axios from "axios";

async function findAll() {
  return await axios
    .get("http://127.0.0.1:8000/api/invoices")
    .then((response) => response.data["hydra:member"]);
}

function deleteInvoice(invoiceId) {
  return axios.delete("http://127.0.0.1:8000/api/invoices/" + invoiceId);
}

export default {
  findAll,
  delete: deleteInvoice,
};
