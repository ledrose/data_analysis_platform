import { Test, TestingModule } from '@nestjs/testing';
import { DatasetFieldService } from './dataset-field.service';

describe('DatasetFieldService', () => {
  let service: DatasetFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatasetFieldService],
    }).compile();

    service = module.get<DatasetFieldService>(DatasetFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
