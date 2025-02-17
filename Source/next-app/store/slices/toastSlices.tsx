import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Toast {
  message?: string;
  type?: number;
}


const initialStateToast: Toast = {message: '', type: 0};

const toastSlice = createSlice({
  name: "toast",
  initialState: initialStateToast,
  reducers: {
    setToastSlice: (state, action: PayloadAction<Toast>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
  },
});

export const { setToastSlice } = toastSlice.actions;
export default toastSlice.reducer;
