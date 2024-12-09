import { Module } from '@nestjs/common';
import { DatasetFieldsService } from './dataset-fields.service';
import { DatasetFieldsController } from './dataset-fields.controller';

@Module({
  providers: [DatasetFieldsService],
  controllers: [DatasetFieldsController]
})
export class DatasetFieldsModule {}
