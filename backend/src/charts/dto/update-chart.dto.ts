import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ChartType } from "../entities/chart.entity";

export class UpdateChartDto {
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
    type?: ChartType;
}