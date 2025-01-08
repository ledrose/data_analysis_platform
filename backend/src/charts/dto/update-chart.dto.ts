import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

export class updateChartDto {
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsString()
    type?: string;
    @IsOptional()
    @Type(type => String)
    xAxis?: [string];
    @IsOptional()
    @Type(type => String)
    yAxis?: [string];
}