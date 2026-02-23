import api from "./api";

export async function getProfile() {
  const token = localStorage.getItem("accessToken");
  console.log("TOKEN:", token);

  try {
    const res = await api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("STATUS:", res.status);
    console.log("RESPONSE:", res.data);

    return res.data;
  } catch (error: any) {
    console.log("ERROR STATUS:", error.response?.status);
    console.log("ERROR RESPONSE:", error.response?.data);

    return null;
  }
}



export async function changePassword(
  oldPassword: string,
  newPassword: string
) {
  try {
    const res = await api.patch("/users/me/password", {
      oldPassword,
      newPassword,
    });
    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "เปลี่ยนรหัสผ่านไม่สำเร็จ";

    throw new Error(message); 
  }
}
