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
    const response = await this.architectsRepository.find({
      relations: ['user'],
    });
    if (!response.length) return [];
    const newData = response.map((architect) => {
      delete architect.user.password;
      return architect;
    });
    return newData;
  }

  async findOne(id: string): Promise<ArchitectsEntity> {
    try {
      const architect = await this.architectsRepository.findOne({
        where: {
          id: id,
        },
        relations: ['user'],
      });
      return architect;
    } catch (error) {
      throw new NotFoundException("Architect doesn't exist");
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
