import { forwardRef, Module } from '@nestjs/common';
import { DatasetTableController } from './dataset-table.controller';
import { DatasetTableService } from './dataset-table.service';
import { DatasetsModule } from '../datasets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasetJoin } from '../entities/dataset-join.entity';
import { SourceModule } from 'src/source/source.module';

@Module({
  controllers: [DatasetTableController],
  imports: [forwardRef(() => DatasetsModule),TypeOrmModule.forFeature([DatasetJoin]), SourceModule],
  providers: [DatasetTableService]
})
export class DatasetTableModule {}
