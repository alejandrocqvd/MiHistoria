import axios from "axios";
import { createContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  currentUser: any; // Replace 'any' with the actual user type, e.g., User | null
  login: (inputs: any) => Promise<void>; // Replace 'any' with the actual input type for login
  logout: () => Promise<void>;
}

// Provide a default value that matches the AuthContextType
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  logout: async () => {},
});

// Type the children prop
export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Handle JSON parsing with a try/catch or a conditional check
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  // Type the 'inputs' parameter according to the expected shape of your login inputs
  const login = async (inputs: any) => { // Replace 'any' with the actual input type for login
    const res = await axios.post("/api/auth/login", inputs);
    setCurrentUser(res.data);
  };

  // Remove 'inputs' parameter if not used
  const logout = async () => {
    await axios.post("/api/auth/logout");
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
