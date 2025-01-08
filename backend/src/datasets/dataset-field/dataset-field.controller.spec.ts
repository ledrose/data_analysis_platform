import { Test, TestingModule } from '@nestjs/testing';
import { DatasetFieldController } from './dataset-field.controller';

describe('DatasetFieldController', () => {
  let controller: DatasetFieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetFieldController],
    }).compile();

    controller = module.get<DatasetFieldController>(DatasetFieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
