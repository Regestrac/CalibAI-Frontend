import api from "../utils/axios";

export const sendMessage = async (conversationId: string, prompt: string, agent: string) => {
  try {
    const { data } = await api.post("/api/agent/chat", {
      conversationId,
      prompt,
      agent
    });

    return data;
  } catch (error) {
    console.log(`Send message error: ${error}`);
    return null;
  }
};
