import { SignInResponseDto } from "../interfaces/auth";
import { Params } from "../interfaces/general";
import { buildFullPath, isEmpty } from "../tools/utilities";
import { ROUTES } from "./api-routes";
import { TokenService } from "./token.service";

/**
 * Abstract class to help bridge the gap between client and server:
 * It does all the data processing to handle, process send and/or receive
 * payloads, responses and errors.
 * See auth.provider.ts to see an example of how it's used
 *
 * FIXME: There must be a cleaner, more simple way to do all of this
 *
 */
export abstract class BaseProvider extends TokenService {
  private apiUrl;

  constructor(apiUrl: string = "http://localhost:3000") {
    super();
    this.apiUrl = apiUrl;
  }

  /**
   * Useful when API authentification is needed
   */
  protected async refreshTokens() {
    const res = await this.httpGet<SignInResponseDto>(
      ROUTES.auth.refresh,
      undefined,
      (await this.getRefreshToken()) ?? undefined
    );

    await this.setAccessToken(res.accessToken);
    await this.setRefreshToken(res.refreshToken);
  }

  /**
   * Useful when API authentification is needed
   */
  protected async retryUnauthorized(callback: Function) {
    await this.refreshTokens();
    return callback();
  }

  protected async handleResponse<T>(
    res: Response,
    callback: Function
  ): Promise<T> {
    const jsonResponse = await res.json();

    if (jsonResponse.statusCode > 299) {
      // Authentification: re-authentificate user if there is
      // an active token in local storage
      if (
        jsonResponse.statusCode === 401 &&
        jsonResponse.name === "JWTExpiredError" &&
        !isEmpty(await this.getRefreshToken())
      ) {
        return this.retryUnauthorized(callback);
      } else {
        throw new Error(jsonResponse.error ?? jsonResponse.name);
      }
    }
    return jsonResponse as T;
  }

  protected async httpGet<T>(
    path: string,
    params?: Params,
    refreshToken?: string
  ) {
    const fullPath = buildFullPath(path, params);
    const requestUrl = this.apiUrl + fullPath;

    const response = await fetch(requestUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${
          refreshToken ?? (await this.getAccessToken())
        }`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return this.handleResponse<T>(response, async () =>
      this.httpGet(path, params)
    );
  }

  protected async httpPost<T>(
    path: string,
    body: Record<string, any> = {},
    params?: Record<string, Params>
  ): Promise<T> {
    const fullPath = buildFullPath(path, params);
    const requestUrl = this.apiUrl + fullPath;

    const request = await fetch(requestUrl, {
      method: "POST",
      credentials: "include",
      headers: new Headers({
        Authorization: `Bearer ${await this.getAccessToken()}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(request, () =>
      this.httpPost(path, body, params)
    );
  }

  protected async httpPatch<T>(
    path: string,
    body: Record<string, any> = {},
    params?: Record<string, Params>
  ): Promise<T> {
    const fullPath = buildFullPath(path, params);
    const requestUrl = this.apiUrl + fullPath;

    const request = await fetch(requestUrl, {
      method: "PATCH",
      credentials: "include",
      headers: new Headers({
        Authorization: `Bearer ${await this.getAccessToken()}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(request, () =>
      this.httpPatch(path, body, params)
    );
  }

  protected async httpDelete<T>(
    path: string,
    body: Record<string, any> = {},
    params?: Record<string, Params>
  ): Promise<T> {
    const fullPath = buildFullPath(path, params);
    const requestUrl = this.apiUrl + fullPath;

    const request = await fetch(requestUrl, {
      method: "DELETE",
      credentials: "include",
      headers: new Headers({
        Authorization: `Bearer ${await this.getAccessToken()}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(request, () =>
      this.httpDelete(path, body, params)
    );
  }
}
