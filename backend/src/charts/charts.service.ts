import { BadRequestException, Injectable } from '@nestjs/common';
import { AddChartDto } from './dto/add-chart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chart } from './entities/chart.entity';
import { Repository } from 'typeorm';
import { DatasetsService } from 'src/datasets/datasets.service';

@Injectable()
export class ChartsService {
    constructor(
        @InjectRepository(Chart)
        private readonly chartRepository: Repository<Chart>,
        private readonly datasetService: DatasetsService
    ) {}
    
    async createChart(addChartDto: AddChartDto, username: string) {
        const datasetId = (await this.datasetService.get_dataset(addChartDto.dataset_id, username))?.id;
        if (!datasetId) {
            throw new BadRequestException('Dataset not found');
        }
        const chart = await this.chartRepository.create({
            ...addChartDto,
            datasetId: datasetId
        });
        return await this.chartRepository.save(chart);
    }

    
}
