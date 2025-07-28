// src/utils/token-manager.ts

const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';

export class TokenManager {


  static async getAccessTokenStatus(): Promise<boolean> {
    return (await this.hasRefreshToken());
  }

  static async getAccessToken(): Promise<string | null> {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static async getRefreshToken(): Promise<string | null> {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  static async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  static async clearTokens(): Promise<void> {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  static async hasAccessToken(): Promise<boolean> {
    return (await this.hasRefreshToken());
  }

  static async hasRefreshToken(): Promise<boolean> {
    return !!(await this.getRefreshToken());
  }
}