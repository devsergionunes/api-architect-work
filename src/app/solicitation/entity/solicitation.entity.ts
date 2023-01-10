import { ArchitectsEntity } from 'src/app/architects/entity/architects.entity';
import { UsersEntity } from 'src/app/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IndexUserWagger } from 'src/app/users/swagger/indexWagger';
import { indexArchitectsWagger } from 'src/app/architects/swagger/indexArchitectsWagger';

@Entity({ name: 'solicitation' })
export class SolicitationsEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @ApiProperty({ type: IndexUserWagger })
  user: UsersEntity;

  @ManyToOne(() => ArchitectsEntity, (architect) => architect.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'architect_id', referencedColumnName: 'id' })
  @ApiProperty({ type: indexArchitectsWagger })
  architect: ArchitectsEntity;

  @Column({ type: 'varchar', length: 500 })
  @ApiProperty()
  description: string;

  @Column({ type: 'int', default: 1 })
  @ApiProperty()
  status: string; // 1 - Solicitada, 2 - Aceita 3 - Recusada 4 - Cancelada

  @Column({ name: 'dt_initial', type: 'date', nullable: true })
  @ApiProperty()
  dtInitial: Date;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;

  constructor(partial?: Partial<SolicitationsEntity>) {
    Object.assign(this, partial);
  }
}
