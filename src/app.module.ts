import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './app/auth/auth.module';
import { ArchitectsModule } from './app/architects/architects.module';
import { UsersModule } from './app/users/users.module';
import { SolicitationModule } from './app/solicitation/solicitation.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATA_BASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    SolicitationModule,
    ArchitectsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
