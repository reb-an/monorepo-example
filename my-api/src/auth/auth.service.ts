import { Injectable } from '@nestjs/common';
import { SignInRequestDto, SignInResponseDto } from '@common/interfaces/auth';

@Injectable()
export class AuthService {
  login(signInDto: SignInRequestDto): SignInResponseDto {
    return { name: signInDto.identifier, refreshToken: '', accessToken: '' };
  }
}
