import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import CreateSchemaInspector from 'knex-schema-inspector';
import { SchemaInspector } from "knex-schema-inspector/dist/types/schema-inspector";
import { JoinInfoDto, TableInfoDto } from "./dto/table-info.dto";
import { table } from "console";



@Injectable()
export class ConnectionMetadataService {
    
    async getAllColumns(knexInstance: Knex) : Promise<TableInfoDto[]>  {
        const inspector = CreateSchemaInspector(knexInstance);
        const tables = await inspector.tables();
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
    
    //TODO finish type mapping
    private mapType(type: string): string {
        return type;
    }


}