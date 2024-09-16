import { StorageService } from "./storage.service";

const ACCESS_TOKEN_KEY = "access-token";
const REFRESH_TOKEN_KEY = "refresh-token";

/**
 * Useful class to handle API auth token
 */
export class TokenService {
  private storage = new StorageService();

  private setToken = async (type: string, token: string) => {
    this.storage.setItem(type, token);
  };

  protected setAccessToken = async (token: string) => {
    this.setToken(ACCESS_TOKEN_KEY, token);
  };

  protected setRefreshToken = async (token: string) => {
    this.setToken(REFRESH_TOKEN_KEY, token);
  };

  protected getAccessToken = async () => {
    return this.storage.getItem(ACCESS_TOKEN_KEY);
  };

  protected getRefreshToken = async () => {
    return this.storage.getItem(REFRESH_TOKEN_KEY);
  };

  protected removeAllTokens = async () => {
    return Promise.all(
      [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY].map(async (key) =>
        this.storage.removeItem(key)
      )
    );
  };
}
