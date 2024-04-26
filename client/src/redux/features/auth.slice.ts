import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
  isAuth: boolean;
  user: null | any;
}

const initialState: authState = {
  isAuth: false,
  user: null,
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<Object>) => {
      state.isAuth = true;
      state.user = action.payload;
    },
    logOut: (state) => {
      console.log("logout");
      state.isAuth = false;
      state.user = null;
    },
  },
});

export default auth.reducer;
