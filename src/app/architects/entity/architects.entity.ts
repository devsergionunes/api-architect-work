import { UsersEntity } from 'src/app/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'architects' })
export class ArchitectsEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  // relation with users
  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty()
  user: UsersEntity;

  @Column({ type: 'varchar', length: 500 })
  @ApiProperty()
  description: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;

  constructor(partial?: Partial<ArchitectsEntity>) {
    Object.assign(this, partial);
  }
}
