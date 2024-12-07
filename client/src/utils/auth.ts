export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  private static readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static inactivityTimer: NodeJS.Timeout | null = null;

  static init(): void {
    ['mousedown', 'keydown', 'touchstart', 'mousemove'].forEach(event => {
      document.addEventListener(event, () => this.resetInactivityTimer());
    });
    this.resetInactivityTimer();
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    const payload = this.parseJwt(token);
    if (payload.exp) {
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, payload.exp.toString());
    }
    this.resetInactivityTimer();
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return false;

    return Date.now() < parseInt(expiry) * 1000;
  }

  private static resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.removeToken();
      window.location.href = '/login?session=expired';
    }, this.INACTIVITY_TIMEOUT);
  }

  private static parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {};
    }
  }
}

// Initialize the authentication service
AuthService.init();

export default AuthService;