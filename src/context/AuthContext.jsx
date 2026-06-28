import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

function readStoredUser(storage) {
  const value = storage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    storage.removeItem(USER_KEY);
    return null;
  }
}

function getStoredAuth() {
  const localToken = localStorage.getItem(TOKEN_KEY);

  if (localToken) {
    return {
      token: localToken,
      user: readStoredUser(localStorage),
    };
  }

  const sessionToken = sessionStorage.getItem(TOKEN_KEY);

  if (sessionToken) {
    return {
      token: sessionToken,
      user: readStoredUser(sessionStorage),
    };
  }

  return {
    token: null,
    user: null,
  };
}

function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

function persistAuth(token, user, rememberMe) {
  clearStoredAuth();

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);

  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
}

function setAuthorizationHeader(token) {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete API.defaults.headers.common.Authorization;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredAuth().token);
  const [user, setUser] = useState(() => getStoredAuth().user);
  useEffect(() => {
  if (token) {
    setAuthorizationHeader(token);
  }
}, []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthorizationHeader(token);
  }, [token]);

  async function login(email, password, rememberMe = true) {
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const newToken = res.data.token;
      const newUser = res.data.user || null;

      persistAuth(newToken, newUser, rememberMe);
      setAuthorizationHeader(newToken);
      setToken(newToken);
      setUser(newUser);

      return res.data;
    } finally {
      setLoading(false);
    }
  }

  async function register(form) {
    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);

      const newToken = res.data.token;
      const newUser = res.data.user || null;

      persistAuth(newToken, newUser, true);
      setToken(newToken);
      setUser(newUser);

      return res.data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearStoredAuth();
    setAuthorizationHeader(null);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
    }),
    [token, user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
