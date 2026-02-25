import api from "@/lib/api";

const API = api;

// ==============================
// Contracts Service (FE)
// ==============================

// Admin - Get all contracts
export const getAllContracts = async () => {
  const res = await API.get("/contracts");
  return res.data;
};

// Tenant - Get my active contract
export const getMyContract = async () => {
  const res = await API.get("/contracts/me");
  return res.data;
};

// Admin - Get contract by id
export const getContractById = async (id: string) => {
  const res = await API.get(`/contracts/${id}`);
  return res.data;
};

// Admin - Create contract
export const createContract = async (data: any) => {
  const res = await API.post("/contracts", data);
  return res.data;
};

// Admin - Update contract
export const updateContract = async (id: string, data: any) => {
  const res = await API.patch(`/contracts/${id}`, data);
  return res.data;
};

// Admin - Delete contract
export const deleteContract = async (id: string) => {
  const res = await API.delete(`/contracts/${id}`);
  return res.data;
};
