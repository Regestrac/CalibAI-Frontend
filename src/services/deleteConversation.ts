import api from "../utils/axios";
import { showErrorToast } from "../utils/toast";

export const deleteConversation = async (conversationId: string) => {
  try {
    const { data } = await api.delete(`/api/chat/delete-conversation/${conversationId}`);

    return data;
  } catch (error) {
    showErrorToast(`Delete conversation error: ${error?.message || error}`);

    return null;
  }
};