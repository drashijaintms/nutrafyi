import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("adminUser")
  ? JSON.parse(localStorage.getItem("adminUser"))
  : null;
const storedToken = localStorage.getItem("adminToken") || null;

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = {
        _id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("adminUser", JSON.stringify(state.user));
      localStorage.setItem("adminToken", state.token);
      if (action.payload.refreshToken) {
        localStorage.setItem("adminRefreshToken", action.payload.refreshToken);
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("adminUser", JSON.stringify(state.user));
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  updateProfile,
} = authSlice.actions;

export default authSlice.reducer;
