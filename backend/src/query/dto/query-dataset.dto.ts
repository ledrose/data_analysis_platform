import { Type } from "class-transformer"
import { IsArray, IsOptional } from "class-validator"

export class QueryDatasetDto {
    @IsArray()
    @IsOptional()
    @Type(type => String)
    fields: string[]

    @IsArray()
    @IsOptional()
    @Type(type => String)
    tables: string[]
}
