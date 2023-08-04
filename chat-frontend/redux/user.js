import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: "",
    user: {},
    users: [],
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setUsersList: (state, action) => {
      state.users = action.payload.users;
    },
  },
});

export const { setToken, setUser, setUsersList } = userSlice.actions;

export const userSliceReducer = userSlice.reducer;
