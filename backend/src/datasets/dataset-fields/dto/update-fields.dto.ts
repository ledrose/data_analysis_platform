
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { AggregateType, DtoType, ValueType } from "src/datasets/entities/dataset-field.entity";



export class DatasetFieldDto {
    @IsNumber()
    id: number

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEnum(ValueType)
    type?: ValueType;

    @IsOptional()
    @IsEnum(DtoType)
    dto_type?: DtoType;

}

export class CalculatedDatasetFieldDto extends DatasetFieldDto {
    @IsOptional()
    @IsString()
    formula: string;
}

export class BaseDatasetFieldDto extends DatasetFieldDto {
    @IsOptional()
    @IsEnum(AggregateType)
    aggregate_type: AggregateType;
    @IsOptional()
    @IsString()
    base_field: string;
}


export class UpdateFieldsDto {
    @ValidateNested({each: true})
    @Type(() => DatasetFieldDto, {
        discriminator: {
            property: 'dto_type',
            subTypes: [
                {value: BaseDatasetFieldDto, name: DtoType.BASE},
                {value: CalculatedDatasetFieldDto, name: DtoType.CALCULATED}
            ]
        },
        keepDiscriminatorProperty: true
    })
    fields: (BaseDatasetFieldDto | CalculatedDatasetFieldDto)[];
}
