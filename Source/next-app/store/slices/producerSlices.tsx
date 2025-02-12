import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Producer {
  value?: string;
}


const initialStateProducer: Producer = {value: ''};

const producerSlice = createSlice({
  name: "producer",
  initialState: initialStateProducer,
  reducers: {
    setProducerSlice: (state, action: PayloadAction<Producer>) => {
      state.value = action.payload.value;
    },
  },
});

export const { setProducerSlice } = producerSlice.actions;
export default producerSlice.reducer;
