import { IsString } from "class-validator";

export class AddDatasetDto {
    @IsString()
    name: string;
    
    @IsString()
    description: string;

    @IsString()
    connection_id: string;
    
    // fields: DatasetFieldDto[];
}
