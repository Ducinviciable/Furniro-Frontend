import { IAuthState } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";
const saveToLocalStorage = (state: IAuthState) => {
  localStorage.setItem("authState", JSON.stringify(state));
};

const loadFromLocalStorage = (): IAuthState => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (serializedState === null) {
      return {
        user: { name: "", email: "", phone: "" },
        isAuthenticated: false,
      };
    }
    return JSON.parse(serializedState);
  } catch {
    return {
      user: { name: "", email: "", phone: "" },
      isAuthenticated: false,
    };
  }
};

const initialState: IAuthState = loadFromLocalStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LOGIN_SUCCESS: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveToLocalStorage(state);
    },
    LOGOUT: (state) => {
      state.user = { name: "", email: "", phone: "" };
      state.isAuthenticated = false;
      saveToLocalStorage(state);
    },
  },
});

export const { LOGIN_SUCCESS, LOGOUT } = authSlice.actions;
export default authSlice.reducer;
