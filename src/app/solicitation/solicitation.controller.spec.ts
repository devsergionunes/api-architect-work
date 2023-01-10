import { Test, TestingModule } from '@nestjs/testing';
import { CreateSolicitationDto } from './dtos/createSolicitationDto';
import { UpdateSolicitationDto } from './dtos/updateSolicitationDto';
import { SolicitationsEntity } from './entity/solicitation.entity';
import { SolicitationController } from './solicitation.controller';
import { SolicitationService } from './solicitation.service';

const requestModk = {
  user: {
    userId: 'id',
  },
};

const solicitationDataMock = new SolicitationsEntity({
  id: 'id-solicitation',
  description: 'Lorem ipson dolor sit amet',
  status: '1',
  dtInitial: new Date(),
});

const solicitationDataMockList = [solicitationDataMock, solicitationDataMock];

const newUpdatesolicitationMock = new SolicitationsEntity({
  id: 'id-solicitation',
  description: 'update solicitation',
  status: '1',
  dtInitial: new Date(),
});

const acceptedSolicitation = new SolicitationsEntity({
  id: 'id-solicitation',
  description: 'update Lorem ipson dolor sit amet',
  status: '2',
  dtInitial: new Date(),
});

const rejectSolicitation = new SolicitationsEntity({
  id: 'id-solicitation',
  description: 'update Lorem ipson dolor sit amet',
  status: '3',
  dtInitial: new Date(),
});

describe('SolicitationController', () => {
  let solicitationController: SolicitationController;
  let solicitationService: SolicitationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitationController],
      providers: [
        {
          provide: SolicitationService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(solicitationDataMockList),
            findOne: jest.fn().mockResolvedValue(solicitationDataMock),
            create: jest.fn().mockResolvedValue(solicitationDataMock),
            update: jest.fn().mockResolvedValue(newUpdatesolicitationMock),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    solicitationController = module.get<SolicitationController>(
      SolicitationController,
    );
    solicitationService = module.get<SolicitationService>(SolicitationService);
  });

  it('should be defined', () => {
    expect(solicitationController).toBeDefined();
    expect(solicitationService).toBeDefined();
  });

  describe('index', () => {
    it('should return an array of solicitation', async () => {
      // act
      const result = await solicitationController.index(requestModk);

      // assert
      expect(result).toEqual(solicitationDataMockList);
      expect(solicitationService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(solicitationService, 'findAll').mockRejectedValue(new Error());

      // act
      const result = solicitationController.index(requestModk);

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should return the created solicitation', async () => {
      // arrange
      const body: CreateSolicitationDto = {
        description: 'Lorem ipson dolor sit amet',
        dtInitial: new Date().toISOString(),
        idArchitect: 'id-architect',
      };

      // act
      const result = await solicitationController.create(body, requestModk);

      // assert
      expect(result.description).toEqual(body.description);
      expect(result).toHaveProperty('id');
      expect(solicitationService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      const body: CreateSolicitationDto = {
        description: 'Lorem ipson dolor sit amet',
        dtInitial: new Date().toISOString(),
        idArchitect: 'id-architect',
      };

      jest.spyOn(solicitationService, 'create').mockRejectedValue(new Error());

      // act
      const result = solicitationController.create(body, requestModk);

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should return an solicitation', async () => {
      // act
      const result = await solicitationController.show(
        'id-solicitation',
        requestModk,
      );

      // assert
      expect(result).toEqual(solicitationDataMock);
      expect(solicitationService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(solicitationService, 'findOne').mockRejectedValue(new Error());

      // act
      const result = solicitationController.show(
        'id-solicitation',
        requestModk,
      );

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should return the request updated by the user', async () => {
      // arrange
      const body: UpdateSolicitationDto = {
        description: 'update solicitation',
        dtInitial: new Date().toISOString(),
      };

      // act
      const result = await solicitationController.update(
        'id-solicitation',
        body,
        requestModk,
      );

      // assert
      expect(result.description).toEqual(newUpdatesolicitationMock.description);
      expect(result).toHaveProperty('id');
      expect('1').toEqual(newUpdatesolicitationMock.status);
      expect(solicitationService.update).toHaveBeenCalledTimes(1);
    });

    it('should return the request accepted by the architect', async () => {
      // arrange
      jest
        .spyOn(solicitationService, 'update')
        .mockResolvedValueOnce(acceptedSolicitation);

      const body: UpdateSolicitationDto = {
        status: '2',
      };

      // act
      const result = await solicitationController.update(
        'id-solicitation',
        body,
        requestModk,
      );

      // assert
      expect(result.status).toEqual(body.status);
      expect(solicitationService.update).toHaveBeenCalledTimes(1);
    });

    it('should return the request rejected by the architect', async () => {
      // arrange
      jest
        .spyOn(solicitationService, 'update')
        .mockResolvedValueOnce(rejectSolicitation);

      const body: UpdateSolicitationDto = {
        status: '3',
      };

      // act
      const result = await solicitationController.update(
        'id-solicitation',
        body,
        requestModk,
      );

      // assert
      expect(result.status).toEqual(body.status);
      expect(solicitationService.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      const body: UpdateSolicitationDto = {
        description: 'Lorem ipson dolor sit amet',
        dtInitial: new Date().toISOString(),
      };

      jest.spyOn(solicitationService, 'update').mockRejectedValue(new Error());

      // act
      const result = solicitationController.update(
        'id-solicitation',
        body,
        requestModk,
      );

      // assert
      await expect(result).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should delete an solicitation', async () => {
      // act
      const result = await solicitationController.destroy(
        'id-solicitation',
        requestModk,
      );

      // assert
      expect(result).toBeUndefined();
      expect(solicitationService.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', async () => {
      // arrange
      jest.spyOn(solicitationService, 'delete').mockRejectedValue(new Error());

      // act
      const result = solicitationController.destroy(
        'id-solicitation',
        requestModk,
      );

      // assert
      await expect(result).rejects.toThrowError();
    });
  });
});
