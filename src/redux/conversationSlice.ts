import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Conversation = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type InitialStateType = {
  conversations: Conversation[];
  activeConversationId: string | null;
  loading: boolean;
};

const initialState: InitialStateType = {
  conversations: [],
  activeConversationId: null,
  loading: false,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    }
  },
});

export const { setConversations, addConversation } = conversationSlice.actions;
export default conversationSlice.reducer;