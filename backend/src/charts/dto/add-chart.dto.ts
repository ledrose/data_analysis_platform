import { IsString } from "class-validator";

export class AddChartDto {
    @IsString()
    dataset_id: string;

    @IsString()
    name: string;
}
