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
      state = action.payload;
    },
  },
});

export const { setUserSlice } = userSlice.actions;
export default userSlice.reducer;
