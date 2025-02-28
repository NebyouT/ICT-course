// Constants for session management
const SESSION_KEY = 'user_session';
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class SessionManager {
  // Save session with expiry
  static saveSession(userData) {
    const session = {
      user: userData,
      expiry: Date.now() + SESSION_EXPIRY,
      sessionId: this.generateSessionId()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  // Get current session
  static getSession() {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      if (Date.now() > session.expiry) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      this.clearSession();
      return null;
    }
  }

  // Clear session
  static clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  // Check if session is valid
  static isSessionValid() {
    const session = this.getSession();
    return session !== null;
  }

  // Generate a unique session ID
  static generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // Refresh session (extend expiry)
  static refreshSession() {
    const currentSession = this.getSession();
    if (currentSession) {
      const refreshedSession = {
        ...currentSession,
        expiry: Date.now() + SESSION_EXPIRY
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(refreshedSession));
      return refreshedSession;
    }
    return null;
  }

  // Get user data from session
  static getUserData() {
    const session = this.getSession();
    return session ? session.user : null;
  }
}

export default SessionManager;
