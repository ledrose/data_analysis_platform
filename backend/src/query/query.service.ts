import { Injectable, InternalServerErrorException, NotImplementedException } from '@nestjs/common';
import { ConnectionsService } from 'src/connections/connections.service';
import { QueryDatasetDto } from './dto/query-dataset.dto';
import { DatasetsService } from 'src/datasets/datasets.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dataset } from 'src/datasets/entities/dataset.entity';
import { Repository } from 'typeorm';
import { DatasetJoin, JoinType } from 'src/datasets/entities/dataset-join.entity';
import { Knex } from 'knex';
import { AggregateType } from 'src/datasets/entities/dataset-field.entity';

@Injectable()
export class QueryService {
    constructor(
        private readonly connectionsService: ConnectionsService,
        private readonly datasetService : DatasetsService,
        @InjectRepository(Dataset)
        private readonly datasetRepository: Repository<Dataset>,
        
    ) {}
    //TODO add 
    async buildQDatasetQuery(queryDto: QueryDatasetDto, datasetId: string, paginationDto: PaginationDto, username: string) {
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
                // sourceTables: true
            }            
        });

        const knex = await this.connectionsService.getConnection(datasetInfo.connection.id,username);
        try {
            console.log(await knex("employee").columnInfo());
        } catch {}
        const requiredTables = [...new Set(datasetInfo.fields.flatMap((field) => field.sourceFields.flatMap((sourceField) => sourceField.sourceTable.name)))];
        let knexBuilder = knex.queryBuilder();
        datasetInfo.fields.forEach((field) => {
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

        knexBuilder = knexBuilder.offset(paginationDto.offset,{skipBinding: true})
        knexBuilder = knexBuilder.limit(paginationDto.limit,{skipBinding: true});
        knexBuilder = knexBuilder.from(requiredTables[0]);

        //Здесь мы пытаемся сделать идиотское дерево из joinов и добавляем только те у которых одной вершины нету в списке
        //Если два поиска закончились неудачно или мы подключили все таблицы, то выходим из цикла.
        const joinedTables = [requiredTables[0]];
        let tempVariable = 0;
        let el: DatasetJoin;
        while (joinedTables.length!=requiredTables.length) {
            tempVariable = joinedTables.length
            el = datasetInfo.joins.find((join) => joinedTables.includes(join.leftSourceField.sourceTable.name)
                && !joinedTables.includes(join.rightSourceField.sourceTable.name));
            if (el!=undefined) {
                joinedTables.push(el.rightSourceField.sourceTable.name);
                this.addJoinFunction(knexBuilder)[el.type.toString()](
                    el.rightSourceField.sourceTable.name,
                    `${el.rightSourceField.sourceTable.name}.${el.rightSourceField.name}`,
                    `${el.leftSourceField.sourceTable.name}.${el.leftSourceField.name}`
                )
            }
            el = datasetInfo.joins.find((join) => !joinedTables.includes(join.leftSourceField.sourceTable.name)
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

    async SqlDatasetQuery(queryDto: QueryDatasetDto, datasetId: string, paginationDto: PaginationDto, username: string) {
        const res = await this.buildQDatasetQuery(queryDto, datasetId, paginationDto, username);
        return res.builder.toSQL().sql;
    }



    async executeQuery(queryDto: QueryDatasetDto, datasetId: string, paginationDto: PaginationDto, user: string) {
        const res = await this.buildQDatasetQuery(queryDto, datasetId, paginationDto, user);
        return await res.builder;
        // throw new Error('Method not implemented.');
    }
    

}
