import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UsersEntity> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findByEmail(email: string): Promise<UsersEntity> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { email: email },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(user: UsersEntity): Promise<UsersEntity> {
    return await this.usersRepository.save(user);
  }

  async update(id: number, user: UsersEntity): Promise<any> {
    return await this.usersRepository.update(id, user);
  }

  async delete(id: number): Promise<any> {
    return await this.usersRepository.delete(id);
  }
}
