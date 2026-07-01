import api from "../utils/axios";
import { showErrorToast } from "../utils/toast";

export const getConversations = async () => {
  try {
    const { data } = await api.get("/api/chat/get-conversations");

    return data;
  } catch (error) {
    showErrorToast(`Get conversations error: ${error?.message || error}`);

    return [];
  }
};