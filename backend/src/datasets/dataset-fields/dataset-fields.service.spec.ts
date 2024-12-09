import { Test, TestingModule } from '@nestjs/testing';
import { DatasetFieldsService } from './dataset-fields.service';

describe('DatasetFieldsService', () => {
  let service: DatasetFieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatasetFieldsService],
    }).compile();

    service = module.get<DatasetFieldsService>(DatasetFieldsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
