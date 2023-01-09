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

@Entity({ name: 'solicitation' })
export class SolicitationsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UsersEntity;

  @ManyToOne(() => ArchitectsEntity, (architect) => architect.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'architect_id', referencedColumnName: 'id' })
  architect: ArchitectsEntity;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'int', default: 1 })
  status: string; // 1 - Solicitada, 2 - Aceita 3 - Recusada 4 - Cancelada

  @Column({ name: 'dt_initial', type: 'date', nullable: true })
  dtInitial: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
}
