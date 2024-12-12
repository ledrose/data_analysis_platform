import { Test, TestingModule } from '@nestjs/testing';
import { DatasetTableService } from './dataset-table.service';

describe('DatasetTableService', () => {
  let service: DatasetTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatasetTableService],
    }).compile();

    service = module.get<DatasetTableService>(DatasetTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
