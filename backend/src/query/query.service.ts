import { Injectable } from '@nestjs/common';
import { ConnectionsService } from 'src/connections/connections.service';
import { QueryDatasetDto } from './dto/query-dataset.dto';
import { DatasetsService } from 'src/datasets/datasets.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dataset } from 'src/datasets/entities/dataset.entity';
import { Repository } from 'typeorm';
import { join } from 'path';
import { DatasetJoin } from 'src/datasets/entities/dataset-join.entity';

@Injectable()
export class QueryService {
    constructor(
        private readonly connectionsService: ConnectionsService,
        private readonly datasetService : DatasetsService,
        @InjectRepository(Dataset)
        private readonly datasetRepository: Repository<Dataset>,
        
    ) {}

    async buildQDatasetuery(queryDto: QueryDatasetDto, datasetId: string, paginationDto: PaginationDto, username: string) {
        const dataset = await this.datasetService.get_dataset(datasetId,username);
        // console.log(dataset)
        const knex = await this.connectionsService.getConnection(dataset.connection.id,username);
        const datasetInfo = await this.datasetRepository.findOne({
            where: {id: datasetId},
            relations: {
                joins: {
                    leftSourceField: {
                        sourceTable: true
                    },
                    rightSourceField: {
                        sourceTable: true
                    }
                },
                fields: {
                    sourceField: {
                        sourceTable: true
                    }
                },
                // sourceTables: true
            }            
        });
        const requiredTables = [...new Set(datasetInfo.fields.map((field) => field.sourceField.sourceTable.name))];
        let knexBuilder = knex.queryBuilder();
        const queryFields = datasetInfo.fields.map((field) => `${field.sourceField.sourceTable.name}.${field.sourceField.name} as ${field.name}`);
        for (const field of queryFields) {
            knexBuilder = knexBuilder.select(field);
        }
        knexBuilder = knexBuilder.from(requiredTables[0]);

        //Здесь мы пытаемся сделать идиотское дерево из joinов и добавляем только те у которых одной вершины нету в списке
        //Если два поиска закончились неудачно или мы подключили все таблицы, то выходим из цикла.
        const joinedTables = [requiredTables[0]];
        let tempVariable = 0;
        let el: DatasetJoin;
        while (tempVariable!=joinedTables.length && joinedTables.length!=requiredTables.length) {
            tempVariable = joinedTables.length
            el = datasetInfo.joins.find((join) => joinedTables.includes(join.leftSourceField.sourceTable.name)
                && !joinedTables.includes(join.rightSourceField.sourceTable.name));
            if (el!=undefined) {
                joinedTables.push(el.rightSourceField.sourceTable.name);
                knexBuilder.leftJoin(
                    el.rightSourceField.sourceTable.name,
                    `${el.rightSourceField.sourceTable.name}.${el.rightSourceField.name}`,
                    `${el.leftSourceField.sourceTable.name}.${el.leftSourceField.name}`
                )
            }
            el = datasetInfo.joins.find((join) => !joinedTables.includes(join.leftSourceField.sourceTable.name)
                && joinedTables.includes(join.rightSourceField.sourceTable.name));
            if (el!=undefined) {
                joinedTables.push(el.rightSourceField.sourceTable.name);
                knexBuilder.leftJoin(
                    el.rightSourceField.sourceTable.name,
                    `${el.leftSourceField.sourceTable.name}.${el.leftSourceField.name}`,
                    `${el.rightSourceField.sourceTable.name}.${el.rightSourceField.name}`
                )
            }
        }
        return await knexBuilder;
        // return datasetInfo
    }
    

}
