import api from "../utils/axios";
import { showErrorToast } from "../utils/toast";

export const getMessages = async (chatId: string) => {
  try {
    const { data } = await api.get(`/api/chat/get-messages/${chatId}`);

    return data;
  } catch (error) {
    showErrorToast("Get messages error: " + error?.message || error);

    return [];
  }
};