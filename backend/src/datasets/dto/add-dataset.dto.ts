import { IsString } from "class-validator";

export class AddDatasetDto {
    @IsString()
    name: string;
    
    @IsString()
    connection_id: string;

    @IsString()
    primary_table: string;
    // fields: DatasetFieldDto[];
}
