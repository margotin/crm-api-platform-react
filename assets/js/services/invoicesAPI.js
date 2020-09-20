import axios from "axios";

async function findAll() {
  return await axios
    .get("http://127.0.0.1:8000/api/invoices")
    .then((response) => response.data["hydra:member"]);
}

async function findInvoice(invoiceId) {
  const response = await axios.get(
    "http://localhost:8000/api/invoices/" + invoiceId
  );
  return response.data;
}

function deleteInvoice(invoiceId) {
  return axios.delete("http://127.0.0.1:8000/api/invoices/" + invoiceId);
}

function updateInvoice(invoiceId, invoice) {
  return axios.put("http://localhost:8000/api/invoices/" + invoiceId, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}

function createInvoice(invoice) {
  return axios.post("http://localhost:8000/api/invoices", {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}

export default {
  findAll,
  find: findInvoice,
  delete: deleteInvoice,
  update: updateInvoice,
  create: createInvoice,
};
