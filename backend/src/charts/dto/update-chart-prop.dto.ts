import { IsEnum, IsInt, IsOptional, ValidateNested } from "class-validator";

export enum ChartPropType {
    XAxis = "xAxis",
    YAxis = "yAxis",
    Filter = "filter",
    Sort = "sort",
}

export class UpdateChartPropDto {
    @IsEnum(ChartPropType)
    chartPropType: ChartPropType;
    @IsInt()
    id: number;
}
