import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class updateChartDto {
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsString()
    description?: string;
    @IsOptional()
    @IsUUID()
    datasetId?: string;
    @IsOptional()
    @IsString()
    type?: string;
}