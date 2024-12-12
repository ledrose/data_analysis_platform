import { Test, TestingModule } from '@nestjs/testing';
import { DatasetTableController } from './dataset-table.controller';

describe('DatasetTableController', () => {
  let controller: DatasetTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetTableController],
    }).compile();

    controller = module.get<DatasetTableController>(DatasetTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
