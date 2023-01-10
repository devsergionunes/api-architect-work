import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dtos/createUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';
import { UsersEntity } from './entity/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const requestModk = {
  user: {
    userId: 'id',
  },
};

const userDataMock: UsersEntity = new UsersEntity({
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'John Doe',
  typeProfile: 1,
});

const userDataUpdateMock: UsersEntity = new UsersEntity({
  id: 'id',
  email: 'email',
  name: 'John Doe updated',
});

const newUserArchitect: UsersEntity = new UsersEntity({
  id: 'id',
  email: 'email',
  name: 'User Architect',
  typeProfile: 2,
});

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(userDataMock),
            create: jest.fn().mockResolvedValue(userDataMock),
            update: jest.fn().mockResolvedValue(userDataUpdateMock),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('index', () => {
    it('should return the logged in user', async () => {
      // act
      const result = await usersController.index(requestModk);

      // assert
      expect(result).toEqual(userDataMock);
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(usersService, 'findOne').mockRejectedValue(new Error());

      // act
      const result = usersController.index(requestModk);

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should return the created user', async () => {
      // arrange
      const body: CreateUserDto = {
        email: 'email',
        password: 'password',
        name: 'John Doe',
        typeProfile: 1,
      };

      // act
      const result = await usersController.create(body);

      // assert
      expect(result).toEqual(userDataMock);
      expect(usersService.create).toHaveBeenCalledTimes(1);
    });

    it('should return the created architect', async () => {
      // arrange
      jest
        .spyOn(usersService, 'create')
        .mockResolvedValueOnce(newUserArchitect);

      const body: CreateUserDto = {
        email: 'email',
        password: 'password',
        name: 'User Architect',
        typeProfile: 2,
        description: 'Lorem ipsum',
        type: 'Urbanist',
      };

      // act
      const result = await usersController.create(body);

      // assert
      expect(result.typeProfile).toEqual(body.typeProfile);
      expect(result.name).toEqual(body.name);
      expect(usersService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      const body: CreateUserDto = {
        email: 'email',
        password: 'password',
        name: 'John Doe',
        typeProfile: 1,
      };
      jest.spyOn(usersService, 'create').mockRejectedValue(new Error());

      // act
      const result = usersController.create(body);

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should return the user', async () => {
      // act
      const result = await usersController.show('id');

      // assert
      expect(result).toEqual(userDataMock);
      expect(usersService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(usersService, 'findOne').mockRejectedValue(new Error());

      // act
      const result = usersController.show('id');

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should return the updated user', async () => {
      // arrange
      const body: UpdateUserDto = {
        email: 'email',
        password: 'password',
        name: 'John Doe updated',
      };

      // act
      const result = await usersController.update('id', body);

      // assert
      expect(result).toEqual(userDataUpdateMock);
      expect(result.name).toEqual(userDataUpdateMock.name);
      expect(usersService.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      const body: UpdateUserDto = {
        email: 'email',
        name: 'John Doe updated',
        password: 'password',
      };
      jest.spyOn(usersService, 'update').mockRejectedValue(new Error());

      // act
      const result = usersController.update('id', body);

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should return undefined', async () => {
      // act
      const result = await usersController.destroy('id');

      // assert
      expect(result).toEqual(undefined);
      expect(usersService.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(usersService, 'delete').mockRejectedValue(new Error());

      // act
      const result = usersController.destroy('id');

      // assert
      await expect(result).rejects.toThrowError();
    });
  });
});
