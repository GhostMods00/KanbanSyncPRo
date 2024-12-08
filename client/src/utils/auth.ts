// src/utils/auth.ts

class AuthService {
  private static tokenKey = 'jwt_token';
  private static expirationKey = 'token_expiration';

  static login(token: string): void {
    // Store the token
    localStorage.setItem(this.tokenKey, token);
    
    // Set expiration to 24 hours from now
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);
    localStorage.setItem(this.expirationKey, expiration.toISOString());
  }

  static logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expirationKey);
    window.location.href = '/login';
  }

  static getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  static loggedIn(): boolean {
    const token = this.getToken();
    const expiration = localStorage.getItem(this.expirationKey);
    
    if (!token || !expiration) {
      return false;
    }

    // Check if token is expired
    const isExpired = new Date() > new Date(expiration);
    if (isExpired) {
      this.logout();
      return false;
    }

    return true;
  }
}

export default AuthService;