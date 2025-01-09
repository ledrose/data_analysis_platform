import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotImplementedException } from '@nestjs/common';
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
        const fields = chartInfo.axes.map((axis) => axis.field);
        const xAxisFields = chartInfo.axes.filter((axis) => axis.type === AxisType.X).map((axis) => axis.field);
        const xError = xAxisFields.filter((axis) => axis.aggregateType != AggregateType.NONE);
        const yAxisFields = chartInfo.axes.filter((axis) => axis.type === AxisType.Y).map((axis) => axis.field);
        const yError = yAxisFields.filter((axis) => axis.aggregateType == AggregateType.NONE);

        //TODO check for complex queries being aggregate 
        //TODO move this check to requests for adding axes
        if (xError.length > 0) {
            throw new BadRequestException(`X axis field ${xError.map((field) => field.name)} is aggregateable which is not supported`);
        }
        if (yError.length > 0) {
            throw new BadRequestException(`Y axis fields ${yError.map((field) => field.name)} is not aggregateable which is not supported`);
        }
        const joins = chartInfo.dataset.joins;
        return (await this.buildQuery(knex, fields, joins, xAxisFields ,0,0));
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
            .addDatasetFields(fields)
            .fromRequiredTables(requiredTables, joins)
            .groupBy(groupBy)
            .offset(offset)
            .limit(limit)
            .build();
    }

    addAggregateFunction(knexBuilder: Knex.QueryBuilder,aggregateType: AggregateType) {
        return (a: string) => {
            switch (aggregateType) {
                case AggregateType.SUM:
                    return knexBuilder.sum(a);
                case AggregateType.COUNT:
                    return knexBuilder.count(a);
                case AggregateType.NONE:
                    return knexBuilder.select(a);
            }
        }
    }
    addJoinFunction(knexBuilder: Knex.QueryBuilder) {
        return {
            "inner": (a,b,c) => knexBuilder.innerJoin(a,b,c),
            "left": (a,b,c) => knexBuilder.leftJoin(a,b,c),
            "right": (a,b,c) => knexBuilder.rightJoin(a,b,c),
        }
    }
    

    // async SqlDatasetQuery(queryDto: QueryDatasetDto, datasetId: string, paginationDto: PaginationDto, username: string) {
    //     const res = await this.buildChartQuery(queryDto, datasetId, paginationDto, username);
    //     return res.builder.toSQL().sql;
    // }



    // async executeQuery(queryDto: QueryDatasetDto, datasetId: string, paginationDto: PaginationDto, user: string) {
    //     const res = await this.buildChartQuery(queryDto, datasetId, paginationDto, user);
    //     return await res.builder;
    //     // throw new Error('Method not implemented.');
    // }
    

}
