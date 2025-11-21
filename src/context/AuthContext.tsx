import { createContext } from "react";
import type { IUser } from "../types/user.type";

export interface IAuthContext {
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  currentUser: null,
  setCurrentUser: () => {},
  logout: () => {},
});

export default AuthContext;
