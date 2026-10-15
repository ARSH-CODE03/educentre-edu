import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "educentre.session";

const demoUsers = {
  admin: { name: "Priya Malhotra", role: "admin", email: "admin@educentre.in", title: "Centre Administrator" },
  teacher: { name: "Rakesh Menon", role: "teacher", email: "rakesh@educentre.in", title: "Physics Faculty" },
  student: { name: "Aarav Sharma", role: "student", email: "aarav@example.com", title: "Class 10 Science" },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore corrupt session */
    }
    setReady(true);
  }, []);

  const login = useCallback(({ email, role }) => {
    // Demo auth. Swap for api.post(endpoints.login, { email, password }) + JWT.
    const base = demoUsers[role] ?? demoUsers.student;
    const session = { ...base, email: email || base.email, role };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, logout, isAuthenticated: Boolean(user) }),
    [user, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

export const roleHome = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};
