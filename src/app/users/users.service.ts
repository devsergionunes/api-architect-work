import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SHA256 } from 'crypto-js';
import { CreateUserDto } from './dtos/createUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';
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
    return await this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async create(user: CreateUserDto): Promise<UsersEntity> {
    const userExists = await this.findByEmail(user.email);

    if (userExists) throw new NotFoundException('User already exists');

    const password = this.hashPassword(user.password);
    const newUser = {
      ...user,
      password,
    };
    return await this.usersRepository.save(newUser);
  }

  async update(id: number, user: UpdateUserDto): Promise<any> {
    return await this.usersRepository.update(id, user);
  }

  async delete(id: number): Promise<any> {
    return await this.usersRepository.delete(id);
  }

  hashPassword(password: string): string {
    return SHA256(password).toString();
  }
}
