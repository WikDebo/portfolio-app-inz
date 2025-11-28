/* eslint-disable @typescript-eslint/no-explicit-any */
class TokenService {
  getUser(): any | null {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("user"); 
      return null;
    }
  }

  setUser(user: any): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  removeUser(): void {
    localStorage.removeItem("user");
  }

  getLocalAccessToken(): string | undefined {
    return this.getUser()?.accessToken;
  }

  getLocalRefreshToken(): string | undefined {
    return this.getUser()?.refreshToken;
  }

  updateLocalAccessToken(token: string): void {
    const user = this.getUser();
    if (!user) return; // prevent crashing
    user.accessToken = token;
    this.setUser(user);
  }
}

export default new TokenService();
