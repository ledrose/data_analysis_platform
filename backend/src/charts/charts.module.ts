import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chart } from './entities/chart.entity';
import { ChartAxis } from './entities/chart-axis.entity';
import { DatasetFieldModule } from 'src/datasets/dataset-field/dataset-field.module';
import { DatasetsModule } from 'src/datasets/datasets.module';

@Module({
  controllers: [ChartsController],
  imports: [TypeOrmModule.forFeature([Chart, ChartAxis]),DatasetFieldModule,DatasetsModule],
  exports: [ChartsService],
  providers: [ChartsService]
})
export class ChartsModule {}
