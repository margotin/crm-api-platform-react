import axios from "axios";
import { INVOICES_API } from "../config";
import Cache from "./cache";

async function findAll() {
  const cachedCustomers = await Cache.get("invoices");
  if (cachedCustomers) {
    return cachedCustomers;
  }

  const response = await axios.get(INVOICES_API);
  const invoices = response.data["hydra:member"];

  Cache.set("invoices", invoices);
  return invoices;
}

async function findInvoice(invoiceId) {
  const response = await axios.get(INVOICES_API + "/" + invoiceId);
  return response.data;
}

function deleteInvoice(invoiceId) {
  return axios.delete(INVOICES_API + "/" + invoiceId);
}

function updateInvoice(invoiceId, invoice) {
  return axios.put(INVOICES_API + "/" + invoiceId, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}

function createInvoice(invoice) {
  return axios.post(INVOICES_API, {
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
