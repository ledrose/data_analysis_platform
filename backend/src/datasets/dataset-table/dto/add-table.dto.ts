import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { JoinType } from "src/datasets/entities/dataset-join.entity";


export class JoinDto {
    @IsString()
    leftSourceField: string
    @IsString()
    rightSourceField: string
    @IsString()
    rightSourceTable: string
    @IsEnum(JoinType)
    type: JoinType
}

export class AddBaseTableDto {
    @IsString()
    name: string

    @IsBoolean()
    auto_populate: boolean = true;
}   

export class AddJoinedTableDto {
    @IsString()
    name: string

    @ValidateNested()
    @Type(type => JoinDto)
    join: JoinDto

}