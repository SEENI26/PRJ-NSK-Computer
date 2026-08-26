import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/services/api';

/**
 * Admin session state.
 *
 * The session itself is a PHP cookie the browser holds; nothing about it is
 * stored in JS. This only tracks *whether* the server still recognises us, by
 * asking `/auth/me` on mount. That means a session expiring server-side shows
 * the login form on the next check rather than leaving a panel that looks
 * signed in and fails every save.
 */

const AuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let live = true;
    auth.me().then((me) => {
      if (!live) return;
      setUser(me);
      setChecking(false);
    });
    return () => { live = false; };
  }, []);

  const value = {
    user,
    checking,
    async signIn(username, password) {
      const me = await auth.login(username, password);
      setUser(me);
      return me;
    },
    async signOut() {
      try {
        await auth.logout();
      } finally {
        // Drop the local view of the session even if the call failed — the
        // cookie may already be gone, and staying "signed in" would be a lie.
        setUser(null);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}
