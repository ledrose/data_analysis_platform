import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { SourceTable } from './entities/source-table.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SourceField } from './entities/source-field.entity';
import { ConnectionsService } from 'src/connections/connections.service';
import { ColumnInfo, ConnectionMetadataService, TableColumnInfo } from 'src/connections/connections.metadata.service';
import { Column } from 'knex-schema-inspector/dist/types/column';
import { table } from 'console';

@Injectable()
export class SourceService {
    constructor(
        @InjectRepository(SourceTable)
        private readonly sourceTableRepository: Repository<SourceTable>,
        @InjectRepository(SourceField)
        private readonly sourceFieldRepository: Repository<SourceField>,
        private readonly connectionMetadataService: ConnectionMetadataService
    ) {}


    async ensureSourceFieldsExist(connectionId: string, tableColumns: Map<string, string[]>) {
        const tableColumnInfo = await this.connectionMetadataService.findColumns(connectionId, tableColumns);
        console.log(JSON.stringify(tableColumnInfo));
        return await this.getOrCreateSourceTables(connectionId, tableColumnInfo);
    }

    //TODO optimize to use bulk insert
    private async getOrCreateSourceTables(connectionId: string, tableColumnInfo: TableColumnInfo<Column>[]): Promise<TableColumnInfo<SourceField>[]> {
        const tableColumnFields: TableColumnInfo<SourceField>[] = [];
        for (const tableInfo of tableColumnInfo) {
            const columnInfo: ColumnInfo<SourceField>[] = [];
            let sourceTable = await this.sourceTableRepository.findOne({where: {name: tableInfo.table}});
            if (!sourceTable) {
                const newSourceTable = this.sourceTableRepository.create({
                    name: tableInfo.table,
                    sourceConnectionId: connectionId,
                });
                sourceTable = await this.sourceTableRepository.save(newSourceTable);
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

    async ensureSourceTablesExist(tableNames: string[]) {
        throw new Error('Method not implemented.');
    }
}
