import { Test, TestingModule } from '@nestjs/testing';
import { DatasetFieldsController } from './dataset-fields.controller';

describe('DatasetFieldsController', () => {
  let controller: DatasetFieldsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetFieldsController],
    }).compile();

    controller = module.get<DatasetFieldsController>(DatasetFieldsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
