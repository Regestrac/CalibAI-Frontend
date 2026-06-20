import api from "../utils/axios";

export const logout = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    console.log(response?.data);
  } catch (error) {
    console.error("Logout error:", error);
  }
};