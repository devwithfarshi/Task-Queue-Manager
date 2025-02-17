import { ACCESS_TOKEN_KEY } from "@/config/keys.const";
import AuthServices from "@/services/AuthServices";
import Cookies from "js-cookie";
import { createContext, useState } from "react";
export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | undefined;
  getLoggedInUser: () => Promise<boolean>;
  user: IUser | null;
};
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);
  const getLoggedInUser = async () => {
    setIsLoading(true);
    try {
      const response = await AuthServices.me();
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
      return response.success;
    } catch (error) {
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const login = (token: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, token);
    setIsAuthenticated(true);
    setIsLoading(false);
  };
  const logout = () => {
    Cookies.get(ACCESS_TOKEN_KEY);
    setIsAuthenticated(false);
    setIsLoading(false);
    setUser(null);
  };
  const getToken = () => {
    return Cookies.get(ACCESS_TOKEN_KEY);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    getToken,
    user,
    getLoggedInUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
