import { Test, TestingModule } from '@nestjs/testing';
import { UsersEntity } from '../users/entity/users.entity';
import { ArchitectsController } from './architects.controller';
import { ArchitectsService } from './architects.service';
import { ArchitectsEntity } from './entity/architects.entity';

const architectData: ArchitectsEntity = new ArchitectsEntity({
  description: 'description',
  type: 'type',
  id: 'id-architect',
  user: new UsersEntity({
    id: 'id-user',
    email: 'email',
    password: 'password',
    name: 'name',
  }),
});

const listArchitects: ArchitectsEntity[] = [architectData, architectData];

describe('ArchitectsController', () => {
  let architectsController: ArchitectsController;
  let architectsService: ArchitectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchitectsController],
      providers: [
        {
          provide: ArchitectsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(listArchitects),
            findOne: jest.fn().mockResolvedValue(architectData),
          },
        },
      ],
    }).compile();

    architectsController =
      module.get<ArchitectsController>(ArchitectsController);
    architectsService = module.get<ArchitectsService>(ArchitectsService);
  });

  it('should be defined', () => {
    expect(architectsController).toBeDefined();
    expect(architectsService).toBeDefined();
  });

  describe('index', () => {
    it('should return an array of architects', async () => {
      // act
      const result = await architectsController.index();

      // assert
      expect(result).toEqual(listArchitects);
      expect(architectsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(architectsService, 'findAll').mockRejectedValue(new Error());

      // act
      const result = architectsController.index();

      // assert
      await expect(result).rejects.toThrow();
      expect(architectsService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('show', () => {
    it('should return an architect', async () => {
      // act
      const result = await architectsController.show('id-architect');

      // assert
      expect(result).toEqual(architectData);
      expect(architectsService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(architectsService, 'findOne').mockRejectedValue(new Error());

      // act
      const result = architectsController.show('id-architect');

      // assert
      await expect(result).rejects.toThrow();
      expect(architectsService.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
