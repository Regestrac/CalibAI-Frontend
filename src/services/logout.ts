import api from "../utils/axios";
import { showErrorToast, showSuccessToast } from "../utils/toast";

export const logout = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    showSuccessToast(response?.data?.message || "Logout successfull.");
  } catch (error) {
    showErrorToast(`Logout error: ${error instanceof Error ? error.message : error}`);
  }
};