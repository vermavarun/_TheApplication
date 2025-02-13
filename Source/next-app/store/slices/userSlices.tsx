import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  login?: string;
  avatar_url?: string;
  name?: string;
  picture?: string;
}


const initialStateUser: User = {login: '', avatar_url: '', name: '', picture: ''};

const userSlice = createSlice({
  name: "user",
  initialState: initialStateUser,
  reducers: {
    setUserSlice: (state, action: PayloadAction<User>) => {
      state.avatar_url = action.payload.avatar_url;
      state.login = action.payload.login;
      state.name = action.payload.name;
      state.picture = action.payload.picture;
      // Object.assign(state, action.payload);
    },
  },
});

export const { setUserSlice } = userSlice.actions;
export default userSlice.reducer;
