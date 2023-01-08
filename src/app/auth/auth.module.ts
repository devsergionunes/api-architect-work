import 'dotenv/config';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStategy } from './localStategy';
import { JwtStrategy } from './jwtStrategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStategy, JwtStrategy],
})
export class AuthModule {}
