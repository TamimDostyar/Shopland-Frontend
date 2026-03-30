import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  login as apiLogin,
  logout as apiLogout,
  getMe,
  refreshAccessToken,
  saveTokens,
  type User,
} from "@amazebid/shared";

export type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setTokensAndUser: (access: string, refresh: string, user: User) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateFromStorage = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const me = await getMe(token);
      setUser(me);
      setAccessToken(token);
    } catch {
      // Try refresh
      const refresh = await getRefreshToken();
      if (refresh) {
        try {
          const { access } = await refreshAccessToken(refresh);
          await saveTokens(access, refresh);
          const me = await getMe(access);
          setUser(me);
          setAccessToken(access);
        } catch {
          await clearTokens();
        }
      } else {
        await clearTokens();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void hydrateFromStorage();
  }, [hydrateFromStorage]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    await saveTokens(res.access, res.refresh);
    setAccessToken(res.access);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    const refresh = await getRefreshToken();
    if (refresh) {
      try {
        await apiLogout(refresh);
      } catch {
        // ignore
      }
    }
    await clearTokens();
    setUser(null);
    setAccessToken(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;
    const me = await getMe(token);
    setUser(me);
  }, []);

  const setTokensAndUser = useCallback(
    async (access: string, refresh: string, u: User) => {
      await saveTokens(access, refresh);
      setAccessToken(access);
      setUser(u);
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        setTokensAndUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
