import { AxiosError } from "axios";
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

// 🔐 แนบ accessToken อัตโนมัติ
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export async function signIn(email: string, password: string) {
  try {
    const res = await api.post("/auth/signin", {
      email,
      password,
    });

    return res.data;
  } catch (err: unknown) {
    const error = err as AxiosError<any>;
    const message =
      (error.response?.data as any)?.message || "Login failed";

    return { error: message };
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export default api;