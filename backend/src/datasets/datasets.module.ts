import { Module } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { DatasetsController } from './datasets.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Dataset } from './entities/dataset.entity';
import { DatasetField } from './entities/dataset-field.entity';
import { DatasetJoin } from './entities/dataset-join.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Connection } from 'src/connections/entities/connection.entity';
import { DatasetFieldModule } from './dataset-field/dataset-field.module';
import { DatasetsGuard } from './datasets.guard';

@Module({
  providers: [DatasetsService,DatasetsGuard],  
  imports: [TypeOrmModule.forFeature([Dataset,DatasetField,DatasetJoin,Connection]), AuthModule, DatasetFieldModule],
  controllers: [DatasetsController],
  exports: [DatasetsService,AuthModule]
})
export class DatasetsModule {}
