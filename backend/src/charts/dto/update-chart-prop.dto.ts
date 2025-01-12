import { x } from "@hapi/joi";
import { Type, TypeHelpOptions } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";

export enum ChartPropType {
    XAxis = "xAxis",
    YAxis = "yAxis",
    Filter = "filter",
    Sort = "sort",
}

class ArgsFilter {
    @IsString()
    operator: string;
    @IsString()
    value1: string;
    @IsString()
    value2?: string;
}
class ArgsSort {
    @IsInt()
    order: number;
    @IsBoolean()
    asc: boolean;
}

class ArgsAxis {

}

export class UpdateChartPropDto {
    @IsEnum(ChartPropType)
    chartPropType: ChartPropType;
    @IsInt()
    id: number;

    @ValidateNested()
    @IsOptional()
    @Type((type: TypeHelpOptions | undefined) => {
        if (type?.object) {
            const object = type.object as UpdateChartPropDto;
            switch (object.chartPropType) {
                case ChartPropType.XAxis:
                case ChartPropType.YAxis:
                    return ArgsAxis;
                case ChartPropType.Filter:
                    return ArgsFilter;
                case ChartPropType.Sort:
                    return ArgsSort;
            }
        }
    })
    args?: ArgsFilter | ArgsSort | ArgsAxis;
}

