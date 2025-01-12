import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, NotImplementedException } from '@nestjs/common';
import { ConnectionsService } from 'src/connections/connections.service';
import { QueryDatasetDto } from './dto/query-dataset.dto';
import { DatasetsService } from 'src/datasets/datasets.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dataset } from 'src/datasets/entities/dataset.entity';
import { Repository } from 'typeorm';
import { DatasetJoin, JoinType } from 'src/datasets/entities/dataset-join.entity';
import { Knex } from 'knex';
import { AggregateType, DatasetField } from 'src/datasets/entities/dataset-field.entity';
import { Chart } from 'src/charts/entities/chart.entity';
import { AxisType } from 'src/charts/entities/chart-axis.entity';
import { User } from 'src/auth/entities/user.entity';
import { QueryBuilderCustom } from './query-builder';

@Injectable()
export class QueryService {
    constructor(
        private readonly connectionsService: ConnectionsService,
        private readonly datasetService : DatasetsService,
        @InjectRepository(Dataset)
        private readonly datasetRepository: Repository<Dataset>,
        @InjectRepository(Chart)
        private readonly chartRepository: Repository<Chart>,
        
    ) {}
    //TODO add 
    async buildDatasetQuery(queryDto: QueryDatasetDto, datasetId: string, paginationDto: PaginationDto, username: string) {
        // throw new NotImplementedException('buildQDatasetQuery');
        const datasetInfo = await this.datasetRepository.findOne({
            where: {id: datasetId},
            relations: {
                connection: true,
                joins: {
                    leftSourceField: {
                        sourceTable: true
                    },
                    rightSourceField: {
                        sourceTable: true
                    },
                },
                fields: {
                    sourceFields: {
                        sourceTable: true
                    }
                },
            }            
        });
        const knex = await this.connectionsService.getConnection(datasetInfo.connection.id,username);
        const fields = datasetInfo.fields;
        const joins = datasetInfo.joins;
        return await this.buildQuery(knex, fields, joins, [],paginationDto.offset,paginationDto.limit);
    }

    async buildChartQuery(chartId: string, username: string) {
        const chartInfo = await this.chartRepository.findOne({
            where: {id: chartId},
            relations: {
                axes: {
                    field: {
                        sourceFields: {
                            sourceTable: true
                        }
                    }
                },
                filters: {
                    field: {
                        sourceFields: {
                            sourceTable: true
                        }
                    }
                },
                sorts: {
                    field: {
                        sourceFields: {
                            sourceTable: true
                        }
                    }
                },
                dataset: {
                    connection: true,
                    joins: {
                        leftSourceField: {
                            sourceTable: true
                        },
                        rightSourceField: {
                            sourceTable: true
                        },
                    }
                }
            }
        })

        const knex = await this.connectionsService.getConnection(chartInfo.dataset.connection.id,username);
        const fields = chartInfo.axes.map((axis) => axis.field)
            .concat(chartInfo.sorts.map((axis) => axis.field))
            .filter((obj,index,self) => index === self.findIndex((t) => t.id === obj.id));
        //These checks not really neccessary but probably will help with debugging
        const xAxisFields = chartInfo.axes.filter((axis) => axis.type === AxisType.X).map((axis) => axis.field);
        if (xAxisFields.length === 0) {
            throw new BadRequestException('X axis not selected');
        }
        if (xAxisFields.some((axis) => axis.aggregateType != AggregateType.NONE)) {
            throw new BadRequestException('X axis field is aggregateable which is not supported');
        }
        const yAxisFields = chartInfo.axes.filter((axis) => axis.type === AxisType.Y).map((axis) => axis.field);
        if (yAxisFields.length === 0) {
            throw new BadRequestException('X axis not selected');
        }
        if (yAxisFields.some((axis) => axis.aggregateType == AggregateType.NONE)) {
            throw new BadRequestException('Y axis field not aggregateable which is not supported');
        }
        const joins = chartInfo.dataset.joins;
        const requiredTables = [...new Set(fields
            .concat(chartInfo.filters.map((axis) => axis.field))
            .flatMap((field) => field.sourceFields.flatMap((sourceField) => sourceField.sourceTable.name)
        ))];

        return QueryBuilderCustom.new(knex)
            .addDatasetFields(fields)
            .fromRequiredTables(requiredTables, joins)
            .groupBy(xAxisFields)
            .filter(chartInfo.filters)
            .sortBy(chartInfo.sorts)
            .build();
        
    }

    async testFormulaField(datasetId: string, testQuery: string, requiredTables: string[]) {
        const datasetInfo = await this.datasetRepository.findOne({
            where: {id: datasetId},
            relations: {
                connection: true,
                joins: {
                    leftSourceField: {
                        sourceTable: true
                    },
                    rightSourceField: {
                        sourceTable: true
                    },
                }
            }            
        });
        const knex = await this.connectionsService.getConnetionNoChecks(datasetInfo.connection.id);
        const builder = QueryBuilderCustom.new(knex)
            .addTestField(testQuery)
            .fromRequiredTables(requiredTables, datasetInfo.joins)
            .build().builder;
        Logger.debug(builder.toSQL().sql);
        await builder;
    }

    async buildQuery(knex: Knex, fields: DatasetField[], joins: DatasetJoin[], groupBy: DatasetField[], offset?: number, limit?: number) {
        const requiredTables = [...new Set(fields.flatMap((field) => field.sourceFields.flatMap((sourceField) => sourceField.sourceTable.name)))];
        console.log(requiredTables);
        return QueryBuilderCustom.new(knex)
            .addDatasetFields(fields, true)
            .fromRequiredTables(requiredTables, joins)
            .groupBy(groupBy)
            .offset(offset)
            .limit(limit)
            .build();
    }


}
