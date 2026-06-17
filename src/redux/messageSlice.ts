import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ArtifactFileType = {
  name: string;
  content: string;
};

export type ArtifactType = {
  id: number;
  type: string;
  title: string;
  files: ArtifactFileType[];
};

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
  artifacts: ArtifactType[],
  isArtifactOpen: boolean,
};

const initialState: InitialStateType = {
  messages: [],
  loading: false,
  artifacts: [],
  isArtifactOpen: false,
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
    setArtifacts: (state, action) => {
      state.artifacts = action?.payload;
    },
    setArtifactOpen: (state, action: PayloadAction<boolean>) => {
      state.isArtifactOpen = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setLoading,
  clearMessages,
  setArtifacts,
  setArtifactOpen,
} = messageSlice.actions;
export default messageSlice.reducer;
