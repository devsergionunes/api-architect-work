import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly password: string;
}
