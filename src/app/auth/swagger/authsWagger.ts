import { ApiProperty } from '@nestjs/swagger';

export class AuthSwagger {
  @ApiProperty()
  access_token: string;
}
