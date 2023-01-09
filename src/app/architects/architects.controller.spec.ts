import { Test, TestingModule } from '@nestjs/testing';
import { ArchitectsController } from './architects.controller';

describe('ArchitectsController', () => {
  let controller: ArchitectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchitectsController],
    }).compile();

    controller = module.get<ArchitectsController>(ArchitectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
