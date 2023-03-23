import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserInterface {
  fullName: string;
  email: string;
  profile: string;
  about: string;
  _id: string;
}

export interface UserSelector {
  user: UserInterface;
}

const initialState = {
  fullName: "",
  email: "",
} as UserInterface;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn(state, action: PayloadAction<UserInterface>) {
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.profile = action.payload.profile;
      state.about = action.payload.about;
      state._id = action.payload._id;
    },
    logout(state) {
      state.fullName = "";
      state.email = "";
      state.profile = "";
      state.about = "";
      state._id = '';
    },
  },
});

export const { logIn, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
