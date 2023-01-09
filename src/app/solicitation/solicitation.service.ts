import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArchitectsService } from 'src/app/architects/architects.service';
import { UsersService } from 'src/app/users/users.service';
import { Repository } from 'typeorm';
import { CreateSolicitationDto } from './dtos/createSolicitationDto';
import { UpdateSolicitationDto } from './dtos/updateSolicitationDto';
import { SolicitationsEntity } from './entity/solicitation.entity';

@Injectable()
export class SolicitationService {
  constructor(
    @InjectRepository(SolicitationsEntity)
    private readonly solicitationsEntity: Repository<SolicitationsEntity>,
    private readonly architectsService: ArchitectsService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(userId: string): Promise<SolicitationsEntity[]> {
    const userData = await this.usersService.findOne(userId);

    const where =
      Number(userData.user.typeProfile) === 2
        ? { architect: { id: userData.architect.id } }
        : { user: { id: userId } };

    const userSolicitation = await this.solicitationsEntity.find({
      relations: ['user', 'architect'],
      where: where,
    });
    return userSolicitation;
  }

  async findOne(id: string, userId: string): Promise<SolicitationsEntity> {
    const [userSolicitation] = await this.solicitationsEntity.find({
      relations: ['user', 'architect'],
      where: { id: id },
    });
    const userData = await this.usersService.findOne(userId);

    if (!userSolicitation) return null;

    if (
      userSolicitation.user.id === userData.user.id ||
      userSolicitation.architect.id === userData.architect.id
    )
      return userSolicitation;
    else
      throw new NotFoundException({
        statusCode: 403,
        message: "You don't have permission to access this solicitation",
      });
  }

  async create(
    solicitation: CreateSolicitationDto,
    userId: string,
  ): Promise<any> {
    const { idArchitect, description, dtInitial } = solicitation;

    const [user, architect] = await Promise.all([
      this.usersService.findOne(userId),
      this.architectsService.findOne(idArchitect),
    ]);

    const newSolicitation = {
      description,
      ...(dtInitial && {
        dtInitial: new Date(dtInitial),
      }),
      architect,
      user: user.user,
    };

    await this.solicitationsEntity.insert(newSolicitation);
    return newSolicitation;
  }

  async update(
    id: string,
    solicitationData: UpdateSolicitationDto,
    userId: string,
  ) {
    const solicitation = await this.findOne(id, userId);

    if (!solicitation) return null;

    const { description, dtInitial, status } = solicitationData;

    const newSolicitation = {
      ...solicitation,
      ...(description && { description }),
      ...(status && solicitation.user.id !== userId && { status }),
      ...(dtInitial && { dtInitial: new Date(dtInitial) }),
    };

    const response = await this.solicitationsEntity.update(id, newSolicitation);
    if (response.affected > 0) return newSolicitation;
    else
      throw new NotFoundException({
        statusCode: 403,
        message: 'Not possible to update this solicitation',
      });
  }

  async delete(id: string, userId: string) {
    const solicitation = await this.findOne(id, userId);

    if (!solicitation) return null;

    return await this.solicitationsEntity.delete(id);
  }
}
