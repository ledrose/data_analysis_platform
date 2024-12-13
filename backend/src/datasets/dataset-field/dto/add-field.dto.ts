import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Validate, ValidateIf, ValidateNested, ValidationArguments, ValidatorConstraintInterface } from "class-validator";
import { format } from "path";
import { CustomFieldsConstraint } from "src/common/fieldConstraint";
import { AggregateType, ValueType } from "src/datasets/entities/dataset-field.entity";


export class SourceFieldLocationDto {
    @IsString()
    column: string;
    @IsString()
    table: string;
}

//TODO fix empty, 
export class AddFieldDto {
    @IsString()
    name: string;
    @IsEnum(ValueType)
    type: ValueType;

    @IsBoolean()
    isSimple: boolean;

    @ValidateIf(o => o.is_simple === true)
    @IsEnum(AggregateType)
    aggregateType?: AggregateType;

    @ValidateIf(o => o.is_simple === false)
    @Validate(CustomFieldsConstraint)
    @IsString()
    formula?: string;

    @Type(type => SourceFieldLocationDto)
    @ValidateNested({each: true})
    sourceFields: SourceFieldLocationDto[];
}