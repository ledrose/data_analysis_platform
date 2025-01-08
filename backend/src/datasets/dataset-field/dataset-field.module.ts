import { forwardRef, Module } from '@nestjs/common';
import { DatasetFieldService } from './dataset-field.service';
import { DatasetFieldController } from './dataset-field.controller';
import { DatasetsModule } from '../datasets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasetField } from '../entities/dataset-field.entity';
import { SourceModule } from 'src/source/source.module';
import { QueryModule } from 'src/query/query.module';

@Module({
  providers: [DatasetFieldService],
  imports: [forwardRef(() => DatasetsModule),TypeOrmModule.forFeature([DatasetField]), SourceModule,forwardRef(() => QueryModule)],
  controllers: [DatasetFieldController],
  exports: [DatasetFieldService]
})
export class DatasetFieldModule {}
