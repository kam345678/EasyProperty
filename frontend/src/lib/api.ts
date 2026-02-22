const BASE_URL = "http://localhost:3000/api/v1/auth";

export async function signIn(body: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json(); 

  if (!res.ok) {
     throw new Error(data.message || "Login failed");
  }

  return data;
}