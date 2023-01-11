import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchitectsService } from '../architects/architects.service';
import { ArchitectsEntity } from '../architects/entity/architects.entity';
import { UsersEntity } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import { CreateSolicitationDto } from './dtos/createSolicitationDto';
import { UpdateSolicitationDto } from './dtos/updateSolicitationDto';
import { SolicitationsEntity } from './entity/solicitation.entity';
import { SolicitationService } from './solicitation.service';

const solicitationDataMock = new SolicitationsEntity({
  id: 'id-solicitation',
  description: 'Test Description',
  dtInitial: new Date(),
  user: new UsersEntity({
    id: 'id-user',
    email: 'email',
    name: 'name',
    password: 'password',
    typeProfile: 1,
  }),
  architect: new ArchitectsEntity({
    id: 'id-architect',
    description: 'Test Architect',
    type: 'Test Type',
  }),
});

const listSolicitationsMock = [solicitationDataMock, solicitationDataMock];

describe('SolicitationService', () => {
  let solicitationService: SolicitationService;
  let solicitationRepository: Repository<SolicitationsEntity>;

  let usersService: UsersService;
  let usersRepository: Repository<UsersEntity>;

  let architectsService: ArchitectsService;
  let architectsRepository: Repository<ArchitectsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SolicitationService,
        {
          provide: getRepositoryToken(SolicitationsEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(listSolicitationsMock),
            insert: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue({ user: solicitationDataMock.user }),
          },
        },
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {},
        },
        {
          provide: ArchitectsService,
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue(solicitationDataMock.architect),
          },
        },
        {
          provide: getRepositoryToken(ArchitectsEntity),
          useValue: {},
        },
      ],
    }).compile();

    solicitationService = module.get<SolicitationService>(SolicitationService);
    solicitationRepository = module.get<Repository<SolicitationsEntity>>(
      getRepositoryToken(SolicitationsEntity),
    );

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UsersEntity>>(
      getRepositoryToken(UsersEntity),
    );

    architectsService = module.get<ArchitectsService>(ArchitectsService);
    architectsRepository = module.get<Repository<ArchitectsEntity>>(
      getRepositoryToken(ArchitectsEntity),
    );
  });

  it('should be defined', () => {
    expect(solicitationService).toBeDefined();
    expect(solicitationRepository).toBeDefined();

    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();

    expect(architectsService).toBeDefined();
    expect(architectsRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all requests from a user', async () => {
      // act
      const result = await solicitationService.findAll('id-user');

      // assert
      expect(result).toEqual(listSolicitationsMock);
      expect(solicitationRepository.find).toBeCalledTimes(1);
    });

    it('should return all requests from an architect', async () => {
      // arrange
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce({
        user: { typeProfile: 2 },
        architect: { id: 'id-architect' },
      });

      // act
      const result = await solicitationService.findAll('id-user');

      // assert
      expect(result).toEqual(listSolicitationsMock);
      expect(solicitationRepository.find).toBeCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(new Error());

      // act
      const result = solicitationService.findAll('id-user');

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return a request', async () => {
      // act
      const result = await solicitationService.findOne(
        'id-solicitation',
        'id-user',
      );

      // assert
      expect(result).toEqual(solicitationDataMock);
      expect(solicitationRepository.find).toBeCalledTimes(1);
    });

    it('should return an unauthorized error', async () => {
      try {
        // arrange
        jest
          .spyOn(usersService, 'findOne')
          .mockResolvedValueOnce({ user: { id: 'id-user-2' }, architect: {} });

        // act
        await solicitationService.findOne('id-solicitation', 'id-user');
      } catch (error) {
        // assert
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          "You don't have permission to access this solicitation",
        );
      }
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(new Error());

      // act
      const result = solicitationService.findOne('id-solicitation', 'id-user');

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a request', async () => {
      // arrange
      const newSolicitation: CreateSolicitationDto = {
        description: 'Test Description',
        dtInitial: new Date().toISOString(),
        idArchitect: 'id-architect',
      };

      // act
      const result = await solicitationService.create(
        newSolicitation,
        'id-user',
      );

      // assert
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('architect');
      expect(result.user.password).toBeUndefined();
      expect(solicitationRepository.insert).toBeCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(new Error());

      const newSolicitation: CreateSolicitationDto = {
        description: 'Test Description',
        dtInitial: new Date().toISOString(),
        idArchitect: 'id-architect',
      };

      // act
      const result = solicitationService.create(newSolicitation, 'id-user');

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a request', async () => {
      // arrange
      const updateSolicitation: UpdateSolicitationDto = {
        description: 'Test Description',
        dtInitial: new Date().toISOString(),
      };

      // act
      const result = await solicitationService.update(
        'id-solicitation',
        updateSolicitation,
        'id-user',
      );

      // assert
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('architect');
      expect(result.user.password).toBeUndefined();
      expect(solicitationRepository.update).toBeCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(new Error());

      const updateSolicitation: UpdateSolicitationDto = {
        description: 'Test Description',
        dtInitial: new Date().toISOString(),
      };

      // act
      const result = solicitationService.update(
        'id-solicitation',
        updateSolicitation,
        'id-user',
      );

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should delete a request', async () => {
      // act
      const result = await solicitationService.delete(
        'id-solicitation',
        'id-user',
      );

      // assert
      expect(result).toBeUndefined();
      expect(solicitationRepository.delete).toBeCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(new Error());

      // act
      const result = solicitationService.delete('id-solicitation', 'id-user');

      // assert
      await expect(result).rejects.toThrowError();
    });
  });
});
