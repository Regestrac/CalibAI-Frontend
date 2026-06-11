import api from "../utils/axios";

export const getMessages = async (chatId: string) => {
  try {
    const { data } = await api.get(`/api/chat/get-messages/${chatId}`);

    return data;
  } catch (error) {
    console.log(error);

    return [];
  }
};