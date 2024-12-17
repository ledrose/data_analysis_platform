import { IsString } from "class-validator";

export class AddChartDto {
    @IsString()
    dataset_id: string;

    @IsString()
    description: string;

    @IsString()
    name: string;
}
