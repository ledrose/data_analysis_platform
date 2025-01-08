import { BadRequestException, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import CreateSchemaInspector from 'knex-schema-inspector';
import { SchemaInspector } from "knex-schema-inspector/dist/types/schema-inspector";
import { JoinInfoDto, TableInfoDto } from "./dto/table-info.dto";
import { ConnectionsService } from "./connections.service";
import { Column } from "knex-schema-inspector/dist/types/column";
import { inspect } from "util";

export type TableColumnInfo<Type> = {
    table: string;
    columnInfo: ColumnInfo<Type>[]
}

export type ColumnInfo<Type> = {
    column: string;
    info: Type
}

@Injectable()
export class ConnectionMetadataService {
    constructor(
        private readonly connectionsService: ConnectionsService
    ) {}




    async findMetadataForColumns(connectionId: string, tableColumns: Map<string, string[]>) : Promise<TableColumnInfo<Column>[]> {
        const knexInstance = await this.connectionsService.getConnetionNoChecks(connectionId);
        const inspector = CreateSchemaInspector(knexInstance);
        const columnInfo = await inspector.columnInfo();
        const result: TableColumnInfo<Column>[] = [];
        for (const [table, columns] of tableColumns) {
            if (!columns) {
                if (!(await inspector.hasTable(table))){
                    throw new BadRequestException(`Table ${table} does not exist`);
                }
                result.push({
                    "table": table,
                    "columnInfo": []
                })
                continue;
            }
            const columnsInfo = await inspector.columnInfo(table);
            const tableResult: ColumnInfo<Column>[] = [];
            for (const column of columns) {
                const fullColumnInfo = this.findFullColumnInfo(columnInfo, table, column);
                if (!fullColumnInfo) {
                    throw new BadRequestException(`Table ${table} does not exist or does not contain column ${column}`);
                }
                tableResult.push({
                    "column": column,
                    "info": fullColumnInfo
                });
            }
            result.push({
                "table": table,
                "columnInfo": tableResult
            });
        }
        return result;
    }

    async checkTablesExisting(connectionId: string, tables: string[]) : Promise<boolean> {
        const knexInstance = await this.connectionsService.getConnetionNoChecks(connectionId);
        const inspector = CreateSchemaInspector(knexInstance);
        const connectionTables = await inspector.tables();
        console.log(connectionTables);
        const missingTables = tables.filter((t) => !connectionTables.includes(t));
        if (missingTables.length != 0) {
            throw new BadRequestException(`Tables ${missingTables} do not in connection ${connectionId}`);
        }
        return true;
    }

    async getColumnsOfTable(connectionId: string, table: string) : Promise<Column[]> {
        const knexInstance = await this.connectionsService.getConnetionNoChecks(connectionId);
        const inspector = CreateSchemaInspector(knexInstance);
        return await inspector.columnInfo(table);
    }

    private findFullColumnInfo(existing_columns: Column[], table: string, column: string) : Column | undefined {
        return existing_columns.find((c) => c.table === table && c.name === column);
    }

    async getAllColumns(knexInstance: Knex) : Promise<TableInfoDto[]>  {
        const inspector = CreateSchemaInspector(knexInstance)
        // inspector.withSchema("production");
        const tables = await inspector.tables();
        console.log(tables);
        return await this.getAllColumnsByTables(inspector, tables);
    }

    async getAllJoins(knexInstance: Knex) : Promise<JoinInfoDto[]>  {
        const inspector = CreateSchemaInspector(knexInstance);
        return await this.getAllJoinsByTables(inspector);
    }

    private async getAllColumnsByTables(inspector: SchemaInspector, tables: string[]) : Promise<TableInfoDto[]> {
        let res_tables = []
        for (const table of tables) {
            const columns = await inspector.columnInfo(table);
            let res_columns = [];
            for (const column of columns) {
                res_columns.push({
                    table: column.table,
                    column: column.name,
                    data_type: this.mapType(column.data_type),
                });   
            }
            res_tables.push({
                table: table,
                columns: res_columns
            })
        }
        return res_tables;
    }

    private async getAllJoinsByTables(inspector: SchemaInspector) : Promise<JoinInfoDto[]> {
        const foreignKeys = await inspector.foreignKeys();
        return foreignKeys.map((fk) => ({
            table1: fk.table,
            column1: fk.column,
            table2: fk.foreign_key_table,
            column2: fk.foreign_key_column
        }));
    }  
    
    //TODO finish type mapping, maaybe yaml config
    private mapType(type: string): string {
        return type;
    }


}