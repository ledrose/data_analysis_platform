import { Module } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { DatasetsController } from './datasets.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Dataset } from './entities/dataset.entity';
import { DatasetField } from './entities/dataset-field.entity';
import { DatasetJoin } from './entities/dataset-join.entity';
import { DatasetFieldsModule } from './dataset-fields/dataset-fields.module';

@Module({
  providers: [DatasetsService],  
  imports: [TypeOrmModule.forFeature([Dataset,DatasetField,DatasetJoin]), DatasetFieldsModule],
  controllers: [DatasetsController],
  exports: [DatasetsService]
})
export class DatasetsModule {}
