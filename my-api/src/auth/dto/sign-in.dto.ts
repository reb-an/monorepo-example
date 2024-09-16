import { SignInRequestDto } from '@common/interfaces/auth';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto implements SignInRequestDto {
  @ApiProperty()
  identifier: string;

  @ApiProperty()
  password: string;
}
