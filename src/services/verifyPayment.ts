import api from "../utils/axios";

type PayloadType = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export const verifyPayment = async (payload: PayloadType) => {
  try {
    const { data } = await api.post("/api/billing/verify", payload);
    console.log('verified: ', data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};