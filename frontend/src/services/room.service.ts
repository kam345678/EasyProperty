import api from "@/lib/api"

export const roomService = {
  getAll: () => api.get("/rooms"),
  getById: (id: string) => api.get(`/rooms/${id}`),
  create: (data: any) => api.post("/rooms", data),
}