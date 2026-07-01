import api from "../utils/axios";
import { showErrorToast } from "../utils/toast";

export const createOrder = async (payload: { plan: "free" | "starter" | "pro"; }) => {
  try {
    const { data } = await api.post("/api/billing/create", payload);
    return data;
  } catch (error) {
    showErrorToast("Create order error: " + error?.message || error);
    return null;
  }
};