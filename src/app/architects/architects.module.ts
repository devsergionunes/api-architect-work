import { ArchitectsController } from './architects.controller';
import { ArchitectsService } from './architects.service';
import { Module } from '@nestjs/common';
import { ArchitectsEntity } from './entity/architects.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArchitectsEntity])],
  controllers: [ArchitectsController],
  providers: [ArchitectsService],
  exports: [ArchitectsService],
})
export class ArchitectsModule {}
