import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { SourceTable } from './entities/source-table.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceField } from './entities/source-field.entity';
import { ConnectionsService } from 'src/connections/connections.service';
import { ColumnInfo, ConnectionMetadataService, TableColumnInfo } from 'src/connections/connections.metadata.service';
import { Column } from 'knex-schema-inspector/dist/types/column';
import { table } from 'console';
import { DatasetsService } from 'src/datasets/datasets.service';

@Injectable()
export class SourceService {
    constructor(
        @InjectRepository(SourceTable)
        private readonly sourceTableRepository: Repository<SourceTable>,
        @InjectRepository(SourceField)
        private readonly sourceFieldRepository: Repository<SourceField>,
        private readonly connectionMetadataService: ConnectionMetadataService,
        private readonly datasetService: DatasetsService,
    ) {}


    async ensureSourceFieldsExist(datasetId: string, tableColumns: Map<string, string[]>) {
        const connectionId = (await this.datasetService.getDatasetNoCheck(datasetId))?.connectionId
        const tableColumnInfo = await this.connectionMetadataService.findMetadataForColumns(connectionId, tableColumns);
        return await this.getOrCreateSourceColumns(datasetId, tableColumnInfo);
    }

    async ensureSourceTableExists(datasetId: string, tableName: string) {
        const connectionId = (await this.datasetService.getDatasetNoCheck(datasetId))?.connectionId;
        await this.connectionMetadataService.checkTablesExisting(connectionId,[tableName])
        return await this.createSourceTable(datasetId, tableName);
    }

    async isSourceTableExists(datasetId: string) {
        const res = await this.sourceTableRepository.findOne({where: {sourceDatasetId: datasetId }});
        console.log(res)
        return res != null;
        // return (await this.sourceTableRepository.find({where: {name: tableName, sourceConnectionId: connectionId}})).length > 0;
    }


    async createSourceTable(datasetId: string, tableName: string) { 
        let sourceTable = await this.sourceTableRepository.findOne({where: {name: tableName, sourceDatasetId: datasetId}});
        if (!sourceTable) {
            const sourceTable = this.sourceTableRepository.create({name: tableName, sourceDatasetId: datasetId});
            return await this.sourceTableRepository.save(sourceTable);
        }
        return sourceTable;
    }

    //TODO optimize to use bulk insert
    async getOrCreateSourceColumns(datasetId: string, tableColumnInfo: TableColumnInfo<Column>[]): Promise<TableColumnInfo<SourceField>[]> {
        const tableColumnFields: TableColumnInfo<SourceField>[] = [];
        for (const tableInfo of tableColumnInfo) {
            // const columnInfo: ColumnInfo<SourceField>[] = [];
            let sourceTable = await this.sourceTableRepository.findOne({where: {name: tableInfo.table}});
            if (!sourceTable) {
                throw new BadRequestException(`Table ${tableInfo.table} is connected to dataset`);
            }
            const insertFields = tableInfo.columnInfo.map((columnInfo) => {
                return {
                    sourceTableId: sourceTable.id,
                    name: columnInfo.info.name,
                    dataType: columnInfo.info.data_type,
                }
            });


            // const names = insertFields.map((field) => field.name);
            // const check = await this.sourceFieldRepository.find({where: {name: In(names)}});
            // if (check.length > 0) {
            //     throw new BadRequestException(`Fields ${check.map((field) => field.name)} already exist`);
            // }

            const insertedIdentifiers = (await this.sourceFieldRepository.createQueryBuilder()
                .insert()
                .into(SourceField)
                .values(insertFields)
                // .orIgnore()
                .orUpdate(['dataType'],['name', 'sourceTableId'])
                .execute()).identifiers as {'id': number}[];
            // console.log(t);
            // const insertedFields = await this.sourceFieldRepository.save(insertFields);


            // const insertedIdentifiers = (await this.sourceFieldRepository.upsert(insertFields,{
            //     conflictPaths: ["name", "sourceTableId"]
            // })).identifiers
            // as {id: number}[];
            // console.log(insertedIdentifiers);
            // const insertedFields = await this.sourceFieldRepository.find({where: {id: In(insertedIdentifiers.map((x)=>x.id)) }});
            // const insertedFields = await this.sourceFieldRepository.save()

            const insertedFields = await this.sourceFieldRepository.find({where: {id: In(insertedIdentifiers.map((x)=>x.id))}});


            console.log(insertedFields);
            tableColumnFields.push({
                table: sourceTable.name,
                columnInfo: insertedFields.map((field) => {
                    return {
                        column: field.name,
                        info: field,
                    }
                })
            })
        }
        return tableColumnFields;
    }

    async deleteSourceTable(datasetId: string, tableId: number) {
        const table = await this.sourceTableRepository.findOne(
            {where: {
                id: tableId,
                sourceDataset: {id: datasetId},
                fields: {rightJoins: []}
            },
            relations: {
                sourceDataset: true,
                fields: {
                    rightJoins: {
                        leftSourceField: {
                            sourceTable: true
                        }
                    }
                }
            }
        });

        if (!table) {
            throw new BadRequestException("Table not found");
        }
        const nonEmptyRightJoins = table.fields.filter((field) => field.rightJoins.length > 0);
        if (nonEmptyRightJoins.length > 0) {
            throw new BadRequestException(`Table ${table.name} has non resolved dependency on ${nonEmptyRightJoins.map((field) => field.rightJoins.map((join) => join.leftSourceField.sourceTable.name)).flat()}`);
        }
        
        return await this.sourceTableRepository.delete({id: table.id},);
    }

}
