import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dtos/createUserDto';
import { UsersEntity } from '../users/entity/users.entity';
import { ArchitectsService } from './architects.service';
import { ArchitectsEntity } from './entity/architects.entity';

const architectMock = new ArchitectsEntity({
  id: 'id-architect',
  description: 'Test Architect',
  type: 'Test Type',
  user: new UsersEntity({
    id: 'id-user',
    email: 'email',
    name: 'name',
    password: 'password',
    typeProfile: 1,
  }),
});

const listArchitectsMock = [architectMock, architectMock];

describe('ArchitectsService', () => {
  let architectsService: ArchitectsService;
  let architectsRepository: Repository<ArchitectsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArchitectsService,
        {
          provide: getRepositoryToken(ArchitectsEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(listArchitectsMock),
            findOne: jest.fn().mockResolvedValue(architectMock),
            save: jest.fn().mockResolvedValue(architectMock),
          },
        },
      ],
    }).compile();

    architectsService = module.get<ArchitectsService>(ArchitectsService);
    architectsRepository = module.get<Repository<ArchitectsEntity>>(
      getRepositoryToken(ArchitectsEntity),
    );
  });

  it('should be defined', () => {
    expect(architectsService).toBeDefined();
    expect(architectsRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of architects', async () => {
      // act
      const result = await architectsService.findAll();

      // assert
      expect(result).toEqual(listArchitectsMock);
      expect(result[0]).toHaveProperty('user');
      expect(result[0].user.password).toBeUndefined();
      expect(architectsRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest
        .spyOn(architectsRepository, 'find')
        .mockRejectedValueOnce(new Error());

      // act
      const result = architectsService.findAll();

      // assert
      expect(result).rejects.toThrow();
      expect(architectsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an architect', async () => {
      // act
      const result = await architectsService.findOne('id-architect');

      // assert
      expect(result).toEqual(architectMock);
      expect(result).toHaveProperty('user');
      expect(result.user.password).toBeUndefined();
      expect(architectsRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest
        .spyOn(architectsRepository, 'findOne')
        .mockRejectedValue(new Error());

      // act
      const result = architectsService.findOne('id-architect');

      // assert
      expect(result).rejects.toThrow(NotFoundException);
      expect(architectsRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('fundByUser', () => {
    it('should return an architect', async () => {
      // act
      const result = await architectsService.fundByUser();

      // assert
      expect(result).toEqual(architectMock);
      expect(result.user).toBeUndefined();
      expect(architectsRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(architectsRepository, 'find').mockRejectedValue(new Error());

      // act
      const result = architectsService.fundByUser();

      // assert
      expect(result).rejects.toThrow(NotFoundException);
      expect(architectsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('ceateArchitects', () => {
    it('should return an architect', async () => {
      // arrange
      const createArchitect: CreateUserDto = {
        email: 'email',
        name: 'name',
        password: 'password',
        typeProfile: 1,
        description: 'Test Architect',
        type: 'Test Type',
      };

      // act
      const result = await architectsService.ceateArchitects(createArchitect);
      // assert
      expect(result).toEqual(architectMock);
      expect(architectsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      const createArchitect: CreateUserDto = {
        email: 'email',
        name: 'name',
        password: 'password',
        typeProfile: 1,
        description: 'Test Architect',
        type: 'Test Type',
      };
      jest.spyOn(architectsRepository, 'save').mockRejectedValue(new Error());

      // act
      const result = architectsService.ceateArchitects(createArchitect);

      // assert
      expect(result).rejects.toThrow();
      expect(architectsRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
