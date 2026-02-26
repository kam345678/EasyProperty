import { AxiosError } from "axios";
import axios from "axios";

let isRefreshing = false;

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // ❌ ไม่ต้อง refresh ถ้าเป็นหน้า login หรือเรียก signin อยู่
      if (
        originalRequest.url?.includes("/auth/signin") ||
        (typeof window !== "undefined" && window.location.pathname === "/login")
      ) {
        return Promise.reject(error);
      }
      // ❌ ถ้าเป็น request refresh เอง ให้ logout ทันที (กัน loop)
      if (originalRequest.url?.includes("/auth/refresh")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export async function signIn(email: string, password: string) {
  try {
    const res = await api.post("/auth/signin", {
      email,
      password,
    });

    return res.data;
  } catch (err: unknown) {
    const error = err as AxiosError<any>;
    const message = (error.response?.data as any)?.message || "Login failed";

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
