import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { AggregateType, ValueType } from "src/datasets/entities/dataset-field.entity";


export class SourceFieldLocationDto {
    @IsString()
    column: string;
    @IsString()
    table: string;
}

//TODO fix empty
export class AddFieldDto {
    @IsString()
    name: string;
    @IsEnum(ValueType)
    type: ValueType;
    @IsEnum(AggregateType)
    aggregateType: AggregateType;
    @ValidateNested()
    @Type(type => SourceFieldLocationDto)
    source_field: SourceFieldLocationDto;
}

// export class SourceFieldColumnDto {
//     column: string;
//     field: AddFieldDto
// }
// export class TestDto {
//     table: string;
//     sourceFieldColumnDto: SourceFieldColumnDto
// }
