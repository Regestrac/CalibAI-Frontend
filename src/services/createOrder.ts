import api from "../utils/axios";

export const createOrder = async (payload: { plan: "free" | "starter" | "pro"; }) => {
  try {
    const { data } = await api.post("/api/billing/create", payload);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};