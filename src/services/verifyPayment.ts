import api from "../utils/axios";
import { showErrorToast, showSuccessToast } from "../utils/toast";

type PayloadType = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export const verifyPayment = async (payload: PayloadType) => {
  try {
    const { data } = await api.post("/api/billing/verify", payload);
    showSuccessToast(data?.message || 'Payment verified.');
    return data;
  } catch (error) {
    showErrorToast("Payment verification error: " + error?.message || error);
    return null;
  }
};