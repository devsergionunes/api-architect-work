import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchitectsService } from '../architects/architects.service';
import { ArchitectsEntity } from '../architects/entity/architects.entity';
import { CreateUserDto } from './dtos/createUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';
import { UsersEntity } from './entity/users.entity';
import { UsersService } from './users.service';

const userMock = new UsersEntity({
  id: 'id-user',
  email: 'email',
  name: 'name',
  password: 'password',
  typeProfile: 1,
});

const userUpdateMock = new UsersEntity({
  id: 'id-user',
  email: 'email@update.com',
  name: 'User Update',
  typeProfile: 1,
});

const listUsersMock = [userMock, userMock];

const userArchitectMock = new ArchitectsEntity({
  id: 'id-architect',
  description: 'Test Architect',
  type: 'Test Type',
  user: new UsersEntity({
    id: 'id-user',
    email: 'email',
    name: 'name',
    password: 'password',
    typeProfile: 2,
  }),
});

const architectMock = new ArchitectsEntity({
  id: 'id-architect',
  description: 'Test Architect',
  type: 'Test Type',
});

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<UsersEntity>;

  let architectsService: ArchitectsService;
  let architectsRepository: Repository<ArchitectsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(listUsersMock),
            findOneOrFail: jest.fn().mockResolvedValue(userMock),
            findOne: jest.fn().mockResolvedValue(userMock),
            save: jest.fn().mockResolvedValue(userMock),
            update: jest.fn().mockResolvedValue(userUpdateMock),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(ArchitectsEntity),
          useValue: {},
        },
        {
          provide: ArchitectsService,
          useValue: {
            ceateArchitects: jest.fn().mockResolvedValue(userArchitectMock),
            fundByUser: jest.fn().mockResolvedValue(architectMock),
          },
        },
      ],
    }).compile();

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
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();

    expect(architectsService).toBeDefined();
    expect(architectsRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // act
      const result = await usersService.findAll();

      // assert
      expect(result).toEqual(listUsersMock);
      expect(result[0].password).toBeUndefined();
      expect(usersRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // arrange
      jest.spyOn(usersRepository, 'find').mockRejectedValueOnce(new Error());

      // act
      const result = usersService.findAll();

      // assert
      expect(result).rejects.toThrow();
      expect(usersRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      // act
      const result = await usersService.findOne(userMock.id);

      // assert
      expect(result.user).toEqual(userMock);
      expect(result.password).toBeUndefined();
      expect(usersRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should return an architect', async () => {
      // arrange
      jest.spyOn(usersRepository, 'findOneOrFail').mockResolvedValueOnce({
        ...userMock,
        typeProfile: 2,
      });

      // act
      const result = await usersService.findOne(userMock.id);

      // assert
      expect(result).toHaveProperty('architect');
      expect(result).toHaveProperty('user');
      expect(result.user.password).toBeUndefined();
      expect(usersRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // arrange
      jest
        .spyOn(usersRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      // act
      const result = usersService.findOne(userMock.id);

      // assert
      expect(result).rejects.toThrow();
      expect(usersRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception when user not found', () => {
      // arrange
      jest
        .spyOn(usersRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new NotFoundException());

      // act
      const result = usersService.findOne(userMock.id);

      // assert
      expect(result).rejects.toThrow(NotFoundException);
      expect(usersRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByEmail', () => {
    it('should return an user', async () => {
      // act
      const result = await usersService.findByEmail(userMock.email);

      // assert
      expect(result).toEqual(userMock);
      expect(result.password).toBeUndefined();
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // arrange
      jest.spyOn(usersRepository, 'findOne').mockRejectedValueOnce(new Error());

      // act
      const result = usersService.findByEmail(userMock.email);

      // assert
      expect(result).rejects.toThrow();
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should return an user', async () => {
      // arrange
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(undefined);

      const newUser: CreateUserDto = {
        name: 'name',
        email: 'email',
        password: 'password',
        typeProfile: 1,
      };
      // act
      const result = await usersService.create(newUser);

      // assert
      expect(result).toEqual(userMock);
      expect(result.password).toBeUndefined();
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should return a new architect', async () => {
      // arrange
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(undefined);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce({
        ...userMock,
        typeProfile: 2,
      });

      const newUser: CreateUserDto = {
        name: 'name',
        email: 'email',
        password: 'password',
        typeProfile: 2,
        description: 'Test Architect',
        type: 'Test Type',
      };
      // act
      const result = await usersService.create(newUser);

      // assert
      expect(result.typeProfile).toEqual(newUser.typeProfile);
      expect(result.password).toBeUndefined();
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an existing user exception', async () => {
      try {
        // arrange
        const newUser: CreateUserDto = {
          name: 'name',
          email: 'email',
          password: 'password',
          typeProfile: 1,
        };
        // act
        await usersService.create(newUser);
      } catch (error) {
        // assert
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User already exists');
      }
    });

    it('should throw an exception', () => {
      // arrange
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(undefined);
      jest.spyOn(usersRepository, 'save').mockRejectedValueOnce(new Error());

      // act
      const result = usersService.create(userMock);

      // assert
      expect(result).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should return an user', async () => {
      // arrange
      const updateUser: UpdateUserDto = {
        email: 'email@update.com',
        name: 'User Update',
        password: 'password',
      };
      // act
      const result = await usersService.update(userMock.id, updateUser);

      // assert
      expect(result).toEqual(userUpdateMock);
      expect(result.password).toBeUndefined();
      expect(usersRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // arrange
      jest.spyOn(usersRepository, 'update').mockRejectedValueOnce(new Error());

      // act
      const result = usersService.update(userMock.id, userMock);

      // assert
      expect(result).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should return an user', async () => {
      // act
      const result = await usersService.delete(userMock.id);

      // assert
      expect(result).toBeUndefined();
      expect(usersRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // arrange
      jest.spyOn(usersRepository, 'delete').mockRejectedValueOnce(new Error());

      // act
      const result = usersService.delete(userMock.id);

      // assert
      expect(result).rejects.toThrow();
      expect(usersRepository.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('hashPassword', () => {
    it('should return a hash password', async () => {
      // arrange
      const password = 'password';
      const hashPassword =
        '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';

      // act
      const result = usersService.hashPassword(password);

      // assert
      expect(result).toEqual(hashPassword);
    });
  });
});
