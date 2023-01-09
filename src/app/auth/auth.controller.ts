import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/authDto';
import { LocalAuthGuard } from './localauth.guard';
import { AuthSwagger } from './swagger/authsWagger';

@Controller('api/v1')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully logged in.',
    type: AuthSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async login(@Request() req, @Body() body: AuthDto) {
    return this.authService.login(req.user);
  }
}
