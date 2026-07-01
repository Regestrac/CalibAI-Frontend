import api from "../utils/axios";
import { showErrorToast } from "../utils/toast";

export const updateConversation = async (id: string, title: string) => {
  try {
    const { data } = await api.post("/api/chat/update-conversation", {
      id,
      title,
    });

    return data;
  } catch (error) {
    showErrorToast(`Update conversation error: ${error?.message || error}`);

    return null;
  }
};
