import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitationsEntity } from './entity/solicitation.entity';
import { UsersModule } from '../users/users.module';
import { ArchitectsModule } from '../architects/architects.module';
import { SolicitationController } from './solicitation.controller';
import { SolicitationService } from './solicitation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitationsEntity]),
    UsersModule,
    ArchitectsModule,
  ],
  controllers: [SolicitationController],
  providers: [SolicitationService],
})
export class SolicitationModule {}
