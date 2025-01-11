import { BadRequestException, Injectable, NotImplementedException } from '@nestjs/common';
import { AddChartDto } from './dto/add-chart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chart } from './entities/chart.entity';
import { Not, Repository } from 'typeorm';
import { DatasetsService } from 'src/datasets/datasets.service';
import { updateChartDto } from './dto/update-chart.dto';
import { AxisType, ChartAxis } from './entities/chart-axis.entity';
import { DatasetFieldService } from 'src/datasets/dataset-field/dataset-field.service';
import { ChartPropType, UpdateChartPropDto } from './dto/update-chart-prop.dto';
import { ChartFilter } from './entities/filter.entity';
import { ChartSort } from './entities/sort.entity';

@Injectable()
export class ChartsService {
    
    
    constructor(
        @InjectRepository(Chart)
        private readonly chartRepository: Repository<Chart>,
        @InjectRepository(ChartFilter)
        private readonly chartFilterRepository: Repository<ChartFilter>,
        @InjectRepository(ChartSort)
        private readonly chartSortRepository: Repository<ChartSort>,
        @InjectRepository(ChartAxis)
        private readonly chartAxisRepository: Repository<ChartAxis>,
        private readonly datasetFieldService: DatasetFieldService,
        private readonly datasetService: DatasetsService
    ) {}
    
    async createChart(addChartDto: AddChartDto, username: string) {
        const datasetId = (await this.datasetService.get_dataset(addChartDto.datasetId, username))?.id;
        if (!datasetId) {
            throw new BadRequestException('Dataset not found');
        }
        const chart = await this.chartRepository.create({
            ...addChartDto,
            datasetId: datasetId
        });
        return await this.chartRepository.save(chart);
    }

    async getChartsByDataset(datasetId: string) {
        return await this.chartRepository.find({where: {datasetId}});
    }

    async deleteChart(chartId: string, user: string) {
        return await this.chartRepository.delete({id: chartId});
    }


    async getCharts(username: string) {
        return await this.chartRepository.find(
            {where: {dataset: {connection: {user: {username}}}},
            relations: {
                dataset: true
            }
        
        }
        );
    }

    async getChart(chartId: string, username: string) {
        return await this.chartRepository.findOne({
            where: {id: chartId, dataset: {connection: {user: {username}}}},
            relations: {
                dataset: {
                    fields: true
                },
                axes: {
                    field: true
                },
                filters: {
                    field: true      
                },
                sorts: {
                    field: true             
                }
            }
        });
    }
    
    async updateChart(chartId: string, username: string, chartDro: updateChartDto) {
        const chart = await this.getChart(chartId,username);
        if (!chart) {
            throw new BadRequestException('Chart not found');
        }
        if (chartDro.name || chartDro.type) {
            const chart = await this.chartRepository.preload({id: chartId, ...chartDro});
            const res = await this.chartRepository.save(chart);
        }
        // if (chartDro.xAxis) {
        //     const xAxis = chartDro.xAxis;
        //     const curentXAxis = chart.axes.filter((axis) => axis.type === AxisType.X);
        //     const toDelete = curentXAxis.filter((axis) => !xAxis.includes(axis.field.name))
        //     const toAdd =  xAxis.filter((axisName) => !curentXAxis.map((axis) => axis.field.name).includes(axisName))
        //     const deleted = await this.chartAxisRepository.remove(toDelete);
        //     const datasetFields =  await this.datasetFieldService.findFields(chart.datasetId, toAdd);
        //     const added = await this.chartAxisRepository.create(toAdd.map((name) => {
        //         return {
        //             chartId: chartId,
        //             type: AxisType.X,
        //             fieldId: datasetFields.find((field) => field.name === name).id
        //         }
        //     } ));
        //     const Xsaved = await this.chartAxisRepository.save(added);
        // }
        // if (chartDro.yAxis) {
        //     const yAxis = chartDro.yAxis;
        //     const curentXAxis = chart.axes.filter((axis) => axis.type === AxisType.X);
        //     const toDelete = curentXAxis.filter((axis) => !yAxis.includes(axis.field.name))
        //     const toAdd =  yAxis.filter((axisName) => !curentXAxis.map((axis) => axis.field.name).includes(axisName))
        //     const deleted = await this.chartAxisRepository.remove(toDelete);
        //     const datasetFields =  await this.datasetFieldService.findFields(chart.datasetId, toAdd);
        //     const added = await this.chartAxisRepository.create(toAdd.map((name) => {
        //         return {
        //             chartId: chartId,
        //             type: AxisType.Y,
        //             fieldId: datasetFields.find((field) => field.name === name).id
        //         }
        //     } ));
        //     const Ysaved = await this.chartAxisRepository.save(added);
        // }
        return {"message": "Chart updated"}
        // throw new NotImplementedException();
    }

    async updateChartProps(chartId: string, type: ChartPropType, user: string, propDto: UpdateChartPropDto) {
        switch (type) {
            case ChartPropType.Sort: {
                const field = await this.chartSortRepository.find(
                    {where: {chartId,  fieldId: propDto.id}, relations: {field: true}}
                )
                if (field.length > 0) {
                    throw new BadRequestException('Field already exists');
                }
                return await this.chartSortRepository.save({chartId, fieldId: propDto.id, ...propDto});
            }
            case ChartPropType.Filter: {

                const field = await this.chartFilterRepository.find(
                    {where: {chartId,  fieldId: propDto.id}, relations: {field: true}}
                )
                if (field.length > 0) {
                    throw new BadRequestException('Field already exists');
                }
                return await this.chartFilterRepository.save({chartId, fieldId: propDto.id, ...propDto});
            }   
            case ChartPropType.XAxis: {
                const field = await this.chartAxisRepository.find(
                    {where: {chartId, fieldId: propDto.id, type: AxisType.X}, relations: {field: true}}
                )
                console.log(field);
                if (field.length > 0) {
                    throw new BadRequestException('Field already exists');
                }
                return await this.chartAxisRepository.save({chartId, fieldId: propDto.id,type: AxisType.X,...propDto});
            }
            case ChartPropType.YAxis: {
                const field = await this.chartAxisRepository.find(
                    {where: {chartId, fieldId: propDto.id, type: AxisType.Y}, relations: {field: true}}
                )
                if (field.length > 0) {
                    throw new BadRequestException('Field already exists');
                }
                return await this.chartAxisRepository.save({chartId, fieldId: propDto.id,type: AxisType.Y, ...propDto});
            }
        }
        throw new NotImplementedException();
    }
    async deleteChartProps(chartId: string, type: ChartPropType, fieldId: number) {
        switch (type) {
            case ChartPropType.Sort: {
                return await this.chartSortRepository.delete({chartId,fieldId});
            }
            case ChartPropType.Filter: {
                return await this.chartFilterRepository.delete({chartId,fieldId});
            }
            case ChartPropType.XAxis: {
                return await this.chartAxisRepository.delete({chartId,fieldId,type: AxisType.X});
            }
            case ChartPropType.YAxis: {
                return await this.chartAxisRepository.delete({chartId,fieldId,type: AxisType.Y});
            }
        }
        throw new NotImplementedException();
    }

}
