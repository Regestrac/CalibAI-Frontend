import api from "../utils/axios"

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/api/me");

    return data;
  } catch (error) {
    console.log(`Current user error: ${error}`);

    return null;
  }
}