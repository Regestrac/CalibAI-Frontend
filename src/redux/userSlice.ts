import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type InitialStateType = {
  userData: {
    name: string;
    userId: string;
    email: string;
    avatarUrl: string;
  };
};

const initialState: InitialStateType = {
  userData: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state: InitialStateType, action: PayloadAction<InitialStateType>) => {
      state.userData = action.payload.userData;
    }
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;