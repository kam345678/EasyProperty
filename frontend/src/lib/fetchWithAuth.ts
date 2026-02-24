import api from '@/lib/api'

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const res = await api.post(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const data = res.data;

    localStorage.setItem("accessToken", data.access_token);

    return data.access_token;
  } catch (error) {
    // refresh token หมดอายุ → logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw new Error("Refresh failed - logged out");
  }
}

export async function fetchWithAuth(
  url: string,
  config: any = {}
) {
  let token = localStorage.getItem("accessToken");

  try {
    const res = await api.request({
      url,
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        token = await refreshAccessToken();

        const retryRes = await api.request({
          url,
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          },
        });

        return retryRes.data;
      } catch (refreshError) {
        window.location.href = "/login";
        throw refreshError;
      }
    }

    throw error;
  }
}