export async function getProfile() {
  const token = localStorage.getItem("accessToken");
  console.log("TOKEN:", token); // 👈 เพิ่มบรรทัดนี้

  const res = await fetch("http://localhost:3000/api/v1/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("STATUS:", res.status);

  const text = await res.text();
  console.log("RESPONSE:", text);

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return JSON.parse(text);
}
