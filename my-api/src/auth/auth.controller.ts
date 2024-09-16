import { ROUTES } from '@common/providers/api-routes';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(ROUTES.auth.login)
  login(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto);
  }
}
