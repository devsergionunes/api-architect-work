import { OmitType } from '@nestjs/swagger';
import { ArchitectsEntity } from '../entity/architects.entity';

export class indexArchitectsWagger extends OmitType(ArchitectsEntity, [
  'user',
]) {}
