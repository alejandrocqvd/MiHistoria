import axios from "axios";
import React, { createContext, useEffect, useState, ReactNode } from "react";

// Interface defining the structure of a user object
interface User {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  dob: string;
  password: string;
}

// Interface defining the structure of the authentication context
interface AuthContextType {
  currentUser: User | null;
  login: (inputs: LoginInputs) => Promise<void>;
  logout: () => Promise<void>;
}

// Interface for login input fields
interface LoginInputs {
  email: string;
  password: string;
}

// Creating a React context for authentication with an optional initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Component providing the authentication context to its children
export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to hold the currently logged-in user
  const [currentUser, setCurrentUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || 'null')
  );

  // Function to log in a user
  const login = async (inputs: LoginInputs) => {
    const res = await axios.post("/api/auth/login", inputs);
    setCurrentUser(res.data);
  }

  // Function to log out the user
  const logout = async () => {
    await axios.post("/api/auth/logout");
    setCurrentUser(null);
  }

  // Effect to update localStorage whenever the current user changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  // Providing the authentication context to child components
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
