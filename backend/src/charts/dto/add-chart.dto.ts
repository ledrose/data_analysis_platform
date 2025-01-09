import { IsString } from "class-validator";

export class AddChartDto {
    @IsString()
    datasetId: string;

    @IsString()
    description: string;

    @IsString()
    name: string;
}
