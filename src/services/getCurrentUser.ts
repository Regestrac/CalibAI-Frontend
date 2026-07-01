import api from "../utils/axios";
import { showErrorToast } from "../utils/toast";

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/api/me");

    return data;
  } catch (error) {
    showErrorToast(`Current user error: ${error?.message || error}`);

    return null;
  }
};