import { IsNotEmpty, IsString, IsIn, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsIn([1, 2])
  typeProfile: number;

  readonly description: string;

  readonly type: string;
}
