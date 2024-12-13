import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chart } from './entities/chart.entity';
import { ChartAxis } from './entities/chart-axis.entity';

@Module({
  controllers: [ChartsController],
  imports: [TypeOrmModule.forFeature([Chart, ChartAxis])],
  providers: [ChartsService]
})
export class ChartsModule {}
