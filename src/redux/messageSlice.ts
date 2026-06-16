import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Message = {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  images?: string[];
};

type InitialStateType = {
  messages: Message[];
  loading: boolean;
};

const initialState: InitialStateType = {
  messages: [],
  loading: false,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { setMessages, addMessage, setLoading, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
