import { Module } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { DatasetsController } from './datasets.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Dataset } from './entities/dataset.entity';
import { DatasetField } from './entities/dataset-field.entity';

@Module({
  providers: [DatasetsService],  
  imports: [TypeOrmModule.forFeature([Dataset,DatasetField])],
  controllers: [DatasetsController]
})
export class DatasetsModule {}
