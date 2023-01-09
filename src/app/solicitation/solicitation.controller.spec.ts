import { Test, TestingModule } from '@nestjs/testing';
import { SolicitationController } from './solicitation.controller';

describe('SolicitationController', () => {
  let controller: SolicitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitationController],
    }).compile();

    controller = module.get<SolicitationController>(SolicitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
