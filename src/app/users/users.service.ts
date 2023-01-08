import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SHA256 } from 'crypto-js';
import { CreateUserDto } from './dtos/createUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';
import { UsersEntity } from './entity/users.entity';
import { ArchitectsService } from '../architects/architects.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly architectsService: ArchitectsService,
  ) {}

  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<any> {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { id: id },
      });
      delete user.password;
      if (Number(user.typeProfile) === 1) return { user };

      const architect = await this.architectsService.fundByUser();
      return { user, architect };
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

    const userCreated = await this.usersRepository.save(newUser);

    if (Number(user.typeProfile) === 1) {
      return userCreated;
    } else {
      // create architect
      await this.architectsService.ceateArchitects(userCreated);
      return userCreated;
    }
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
