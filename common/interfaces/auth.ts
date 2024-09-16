export type SignInRequestDto = {
  identifier: string;
  password: string;
};

export interface SignInResponseDto {
  accessToken: string;
  refreshToken: string;
  name: string;
}
