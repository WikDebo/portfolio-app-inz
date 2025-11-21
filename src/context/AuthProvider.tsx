import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import type { IUser } from "../types/user.type";
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) setCurrentUser(user);

    const handleLogout = () => setCurrentUser(null);
    EventBus.on("logout", handleLogout);
    return () => EventBus.remove("logout", handleLogout);
  }, []);

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    EventBus.dispatch("logout");
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
