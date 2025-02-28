import { refreshSession } from "@/features/authSlice";
import SessionManager from "@/utils/sessionManager";

// Check session every 5 minutes
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

const sessionMiddleware = (store) => {
  let sessionCheckInterval;

  return (next) => (action) => {
    // Start session check on login
    if (action.type === 'authSlice/userLoggedIn') {
      if (!sessionCheckInterval) {
        sessionCheckInterval = setInterval(() => {
          if (SessionManager.isSessionValid()) {
            store.dispatch(refreshSession());
          } else {
            clearInterval(sessionCheckInterval);
            sessionCheckInterval = null;
          }
        }, SESSION_CHECK_INTERVAL);
      }
    }

    // Clear interval on logout
    if (action.type === 'authSlice/userLoggedOut') {
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
        sessionCheckInterval = null;
      }
    }

    return next(action);
  };
};

export default sessionMiddleware;
