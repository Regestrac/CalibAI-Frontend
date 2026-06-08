import api from "../utils/axios";

export const createConversation = async () => {
  try {
    const { data } = await api.get("/api/chat/create-conversations");

    return data;
  } catch (error) {
    console.log(`Create conversation error: ${error}`);

    return [];
  }
};