async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await fetch("http://localhost:3000/api/v1/auth/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!res.ok) {
    // refresh token หมดอายุ → logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw new Error("Refresh failed - logged out");
  }

  const data = await res.json();
  localStorage.setItem("accessToken", data.access_token);

  return data.access_token;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let token = localStorage.getItem("accessToken");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    try {
      token = await refreshAccessToken();

      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      // ถ้า refresh ล้มเหลว → redirect ไป login
      window.location.href = "/login";
      return res;
    }
  }

  return res;
}