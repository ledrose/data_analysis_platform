import { Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { QueryService } from './query.service';
import { DatasetsModule } from 'src/datasets/datasets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dataset } from 'src/datasets/entities/dataset.entity';

@Module({
  imports: [ConnectionsModule,DatasetsModule,TypeOrmModule.forFeature([Dataset])],
  controllers: [QueryController],
  providers: [QueryService]
})
export class QueryModule {}
