import { forwardRef, Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { ConnectionsModule } from 'src/connections/connections.module';
import { QueryService } from './query.service';
import { DatasetsModule } from 'src/datasets/datasets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dataset } from 'src/datasets/entities/dataset.entity';
import { ChartsModule } from 'src/charts/charts.module';
import { Chart } from 'src/charts/entities/chart.entity';

@Module({
  imports: [ConnectionsModule,forwardRef(() => DatasetsModule),ChartsModule, TypeOrmModule.forFeature([Dataset,Chart])],
  controllers: [QueryController],
  providers: [QueryService],
  exports: [QueryService]
})
export class QueryModule {}
