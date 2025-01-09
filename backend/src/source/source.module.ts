import { forwardRef, Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceTable } from './entities/source-table.entity';
import { SourceField } from './entities/source-field.entity';
import { ConnectionsModule } from 'src/connections/connections.module';
import { DatasetsModule } from 'src/datasets/datasets.module';
import { DatasetField } from 'src/datasets/entities/dataset-field.entity';

@Module({
  providers: [SourceService],
  imports: [TypeOrmModule.forFeature([SourceTable,SourceField,DatasetField]),ConnectionsModule,forwardRef(() => DatasetsModule)],
  controllers: [],
  exports: [SourceService]
})
export class SourceModule {}
