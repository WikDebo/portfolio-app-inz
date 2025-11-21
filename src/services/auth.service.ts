import type { IUser } from "../types/user.type";
import api from "./api";
import TokenService from "./token.service";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  async login(username: string, password: string) {
    return api
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }return response.data;
  });
}

  logout() {
  const refreshToken = TokenService.getLocalRefreshToken();
  if (refreshToken) {
    api.post(API_URL+"logout", { refreshToken });
  }
  TokenService.removeUser();
}

  register(username: string, email: string, password: string) {
    return api.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }
  
  getCurrentUser() {
    return TokenService.getUser();
  }
  // auth.service.ts

updateStoredUser(updates: Partial<IUser>) {
  const current = TokenService.getUser(); 
  if (!current) return;

  const updated = { ...current, ...updates };
  localStorage.setItem("user", JSON.stringify(updated));
  return updated;
}

}

export default new AuthService();
