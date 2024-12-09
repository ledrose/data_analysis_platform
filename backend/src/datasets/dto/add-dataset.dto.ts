import { IsString } from "class-validator";
import { DatasetFieldDto } from "./dataset-field.dto";

export class AddDatasetDto {
    @IsString()
    name: string;
    
    @IsString()
    connection_id: string;

    @IsString()
    primary_table: string;
    // fields: DatasetFieldDto[];
}
