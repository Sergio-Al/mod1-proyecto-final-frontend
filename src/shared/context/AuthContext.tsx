import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface TokenPayload {
  id: number;
  email: string;
  exp: number;
  iat: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage on initial load
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<TokenPayload>(storedToken);
        console.log("Decoded token:", storedToken, decoded);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setToken(storedToken);
          setIsAuthenticated(true);
          setUserId(decoded.id);
        } else {
          // Token expired
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        // Invalid token
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode<TokenPayload>(newToken);
      setToken(newToken);
      console.log('trueeee')
      setIsAuthenticated(true);
      setUserId(decoded.id);
      localStorage.setItem("token", newToken);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem("token");
    // Optionally, you can also redirect the user to the login page using react-router-dom
    navigate('/login');
  };

  const value = {
    isAuthenticated,
    token,
    userId,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
