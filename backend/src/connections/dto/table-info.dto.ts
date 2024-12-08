export class TableInfoDto {
    name: string;
    columns: ColumnInfoDto[];
}

export class ColumnInfoDto {
    name: string;
    data_type: string;   
}

export class JoinInfoDto {
    table1: string;
    column1: string;
    table2: string;
    column2: string;
}
