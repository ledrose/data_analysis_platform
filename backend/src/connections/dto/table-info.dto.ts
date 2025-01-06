export class TableInfoDto {
    table: string;
    columns: ColumnInfoDto[];
}

export class ColumnInfoDto {
    table: string;
    column: string;
    data_type: string;   
}

export class JoinInfoDto {
    table1: string;
    column1: string;
    table2: string;
    column2: string;
}

export class TableMetadataDto {
    columns: TableInfoDto[];
    joins: JoinInfoDto[];
}