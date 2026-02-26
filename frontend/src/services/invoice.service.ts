import api from "@/lib/api";

const API = api;

export const invoiceService = {
  createInvoice: async (data: any) => {
    const res = await API.post(`/invoices`, data);
    return res.data;
  },

  getAllInvoices: async () => {
    const res = await API.get(`/invoices`);
    return res.data;
  },

  getInvoiceById: async (id: string) => {
    const res = await API.get(`/invoices/${id}`);
    return res.data;
  },

  getMyInvoices: async () => {
    const res = await API.get(`/invoices/my`);
    return res.data;
  },

  payInvoice: async (id: string, file: File, paidAt: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("paidAt", paidAt);

    const res = await API.patch(`/invoices/${id}/pay`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  confirmInvoice: async (id: string, status: "paid" | "rejected") => {
    const res = await API.patch(`/invoices/${id}/confirm`, { status });
    return res.data;
  },

  deleteInvoice: async (id: string) => {
    const res = await API.patch(`/invoices/${id}/delete`);
    return res.data;
  },
};
