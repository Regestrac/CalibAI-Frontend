import api from "../utils/axios";

export const logout = async () => {
  try {
    const { data } = await api.post("/api/auth/logout");
    console.log(data);
  } catch (error) {
    console.log(`Logout error: ${error}`);
  }
};