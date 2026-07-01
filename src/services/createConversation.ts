import api from "../utils/axios";
import { showErrorToast } from "../utils/toast";

export const createConversation = async () => {
  try {
    const { data } = await api.get("/api/chat/create-conversation");

    return data;
  } catch (error) {
    showErrorToast(`Create conversation error: ${error?.message || error}`);

    return null;
  }
};