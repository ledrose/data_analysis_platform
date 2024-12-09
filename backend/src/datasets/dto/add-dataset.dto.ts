import { DatasetFieldDto } from "./dataset-field.dto";

export class AddDatasetDto {
    name: string;
    connection_id: number;
    primary_table: string;
    // fields: DatasetFieldDto[];
}
