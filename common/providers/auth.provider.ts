import { SignInRequestDto, SignInResponseDto } from "../interfaces/auth";
import { ROUTES } from "./api-routes";
import { BaseProvider } from "./base.provider";

export class AuthProvider extends BaseProvider {
  public async login(payload: SignInRequestDto) {
    return this.httpPost<SignInResponseDto>(ROUTES.auth.login, {
      ...payload,
    }).then(async (res) => {
      //Set local API auth tokens when signing in
      await this.setAccessToken(res.accessToken);
      await this.setRefreshToken(res.refreshToken);

      return res;
    });
  }
  public async logout() {
    return this.httpPost(ROUTES.auth.logout).then(async () => {
      //Remove local API auth tokens when signing out
      await this.removeAllTokens();
    });
  }
}
