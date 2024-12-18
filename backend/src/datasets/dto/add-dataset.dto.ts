import { IsString } from "class-validator";

export class AddDatasetDto {
    @IsString()
    name: string;
    
    @IsString()
    description: string;

    @IsString()
    connectionId: string;
    
    // fields: DatasetFieldDto[];
}
