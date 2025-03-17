// Constants for session management
const SESSION_KEY = 'user_session';
const TOKEN_KEY = 'token';
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
    localStorage.removeItem(TOKEN_KEY);
  }

  // Check if session is valid
  static isSessionValid() {
    const session = this.getSession();
    const token = localStorage.getItem(TOKEN_KEY);
    return session !== null && token !== null;
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

  // Get token
  static getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Save token
  static saveToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      return true;
    }
    return false;
  }

  // Check if we have a valid authentication setup
  static hasValidAuth() {
    const session = this.getSession();
    const token = this.getToken();
    return session !== null && token !== null;
  }
}

export default SessionManager;
