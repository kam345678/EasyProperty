import { AxiosError } from "axios";
import axios from "axios"; //npm install axios
  
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: true,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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

    return {error : message}
  }
}

export async function logout() {
  try {
    const token = localStorage.getItem("accessToken");

    if (token) {
      await api.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    // ไม่ต้อง throw เพราะเราจะ logout ฝั่ง client อยู่แล้ว
    console.error("Logout API failed:", error);
  } finally {
    // ล้าง token ฝั่ง client เสมอ
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export default api