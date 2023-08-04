import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = [...state.messages, action.payload.message];
    },
    getMessages: (state, action) => {
      state.messages = action.payload.messages;
    },
  },
});

export const { setMessages, getMessages } = chatSlice.actions;
export const chatSliceReducer = chatSlice.reducer;
