import { forwardRef, Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chart } from './entities/chart.entity';
import { ChartAxis } from './entities/chart-axis.entity';
import { DatasetsModule } from 'src/datasets/datasets.module';
import { ChartFilter } from './entities/filter.entity';
import { ChartSort } from './entities/sort.entity';

@Module({
  controllers: [ChartsController],
  imports: [TypeOrmModule.forFeature([Chart, ChartAxis,ChartFilter,ChartSort]),forwardRef(() => DatasetsModule)],
  exports: [ChartsService],
  providers: [ChartsService]
})
export class ChartsModule {}
