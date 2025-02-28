import { createSlice } from "@reduxjs/toolkit";
import SessionManager from "@/utils/sessionManager";

// Initialize state from session if it exists
const savedSession = SessionManager.getSession();
const initialState = {
  user: savedSession?.user || null,
  isAuthenticated: !!savedSession,
  sessionId: savedSession?.sessionId || null
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      const session = SessionManager.saveSession(action.payload.user);
      state.user = session.user;
      state.isAuthenticated = true;
      state.sessionId = session.sessionId;
    },
    userLoggedOut: (state) => {
      SessionManager.clearSession();
      state.user = null;
      state.isAuthenticated = false;
      state.sessionId = null;
    },
    refreshSession: (state) => {
      const session = SessionManager.refreshSession();
      if (session) {
        state.user = session.user;
        state.isAuthenticated = true;
        state.sessionId = session.sessionId;
      } else {
        state.user = null;
        state.isAuthenticated = false;
        state.sessionId = null;
      }
    }
  },
});

export const { userLoggedIn, userLoggedOut, refreshSession } = authSlice.actions;
export default authSlice.reducer;
