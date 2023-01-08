import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dtos/createUserDto';
import { ArchitectsEntity } from './entity/architects.entity';

@Injectable()
export class ArchitectsService {
  constructor(
    @InjectRepository(ArchitectsEntity)
    private readonly architectsRepository: Repository<ArchitectsEntity>,
  ) {}

  async findAll(): Promise<ArchitectsEntity[]> {
    return await this.architectsRepository.find();
  }

  async findOne(id: number): Promise<ArchitectsEntity> {
    try {
      const architect = await this.architectsRepository.findOneOrFail({
        where: {
          id: id,
        },
      });
      return architect;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async fundByUser(): Promise<ArchitectsEntity> {
    try {
      const architect = await this.architectsRepository.find({
        relations: ['user'],
      });
      if (!architect.length) return null;
      delete architect[0].user;
      return architect[0];
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async ceateArchitects(user: CreateUserDto) {
    const { description, type } = user;
    const architect = {
      description,
      type,
      user,
    };
    return await this.architectsRepository.save(architect);
  }
}
