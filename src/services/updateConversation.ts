import api from "../utils/axios";

export const updateConversation = async (id: string, title: string) => {
  try {
    const { data } = await api.post("/api/chat/update-conversation", {
      id,
      title,
    });

    return data;
  } catch (error) {
    console.log(`Update conversation error: ${error}`);

    return null;
  }
};
