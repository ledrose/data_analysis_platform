import { BadRequestException, Injectable, InternalServerErrorException, NotImplementedException } from '@nestjs/common';
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
        if (xError.length > 0) {
            throw new BadRequestException(`X axis field ${xError.map((field) => field.name)} is aggregateable which is not supported`);
        }
        if (yError.length > 0) {
            throw new BadRequestException(`Y axis fields ${yError.map((field) => field.name)} is not aggregateable which is not supported`);
        }
        const joins = chartInfo.dataset.joins;
        return (await this.buildQuery(knex, fields, joins, xAxisFields ,0,0));
    }

    async buildQuery(knex: Knex, fields: DatasetField[], joins: DatasetJoin[], groupBy: DatasetField[], offset?: number, limit?: number) {
        const requiredTables = [...new Set(fields.flatMap((field) => field.sourceFields.flatMap((sourceField) => sourceField.sourceTable.name)))];
        let knexBuilder = knex.queryBuilder();
        fields.forEach((field) => {
            if (field.isSimple) {
                const fieldString = `${field.sourceFields[0].sourceTable.name}.${field.sourceFields[0].name} as ${field.name}`;   
                knexBuilder = this.addAggregateFunction(knexBuilder,field.aggregateType)(fieldString);
            } else {
                let fieldString = `${field.formula} as ${field.name}`;
                for (let i=0; i<field.sourceFields.length;i++) {
                    fieldString = fieldString.replaceAll("${"+i+"}",`"${field.sourceFields[i].sourceTable.name}"."${field.sourceFields[i].name}"`);
                }
                knexBuilder = knexBuilder.select(knex.raw(fieldString));
                // knexBuilder = this.addAggregateFunction(knexBuilder,field.aggregateType)(fieldString);
            }
        })

        if (offset) {
            knexBuilder = knexBuilder.offset(offset,{skipBinding: true})
        }
        if (limit) {
            knexBuilder = knexBuilder.limit(limit,{skipBinding: true});
        }
        knexBuilder = knexBuilder.from(requiredTables[0]);

        //Здесь мы пытаемся сделать идиотское дерево из joinов и добавляем только те у которых одной вершины нету в списке
        //Если два поиска закончились неудачно или мы подключили все таблицы, то выходим из цикла.
        const joinedTables = [requiredTables[0]];
        let tempVariable = 0;
        let el: DatasetJoin;
        while (joinedTables.length!=requiredTables.length) {
            tempVariable = joinedTables.length
            el = joins.find((join) => joinedTables.includes(join.leftSourceField.sourceTable.name)
                && !joinedTables.includes(join.rightSourceField.sourceTable.name));
            if (el!=undefined) {
                joinedTables.push(el.rightSourceField.sourceTable.name);
                this.addJoinFunction(knexBuilder)[el.type.toString()](
                    el.rightSourceField.sourceTable.name,
                    `${el.rightSourceField.sourceTable.name}.${el.rightSourceField.name}`,
                    `${el.leftSourceField.sourceTable.name}.${el.leftSourceField.name}`
                )
            }
            el = joins.find((join) => !joinedTables.includes(join.leftSourceField.sourceTable.name)
                && joinedTables.includes(join.rightSourceField.sourceTable.name));
            if (el!=undefined) {
                joinedTables.push(el.rightSourceField.sourceTable.name);
                this.addJoinFunction(knexBuilder)[el.type.toString()](
                    el.rightSourceField.sourceTable.name,
                    `${el.leftSourceField.sourceTable.name}.${el.leftSourceField.name}`,
                    `${el.rightSourceField.sourceTable.name}.${el.rightSourceField.name}`
                )
            }
            //Если ничего небыло сделано за циклы, значит таблицы не связаны
            if (tempVariable==joinedTables.length) {
                throw new InternalServerErrorException("Query build failed: Joins resolution failed")
            }
        }
        groupBy.forEach((field) => {
            knexBuilder = knexBuilder.groupBy(field.name)
        })

        //Avoiding auto execution, JS is stupid
        return {builder:  knexBuilder};
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
