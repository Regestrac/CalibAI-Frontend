import api from "../utils/axios";
import { showErrorToast } from "../utils/toast";

export const sendMessage = async (
  conversationId: string,
  prompt: string,
  agent: string,
  file?: File | null
) => {
  try {
    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("prompt", prompt);
    formData.append("agent", agent);
    if (file) {
      formData.append("file", file);
    }

    const { data } = await api.post("/api/agent/chat", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  } catch (error) {
    showErrorToast(`Send message error: ${error instanceof Error ? error.message : error}`);
    return null;
  }
};
