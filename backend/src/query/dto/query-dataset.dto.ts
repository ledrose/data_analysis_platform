import { Type } from "class-transformer"
import { IsArray } from "class-validator"

export class QueryDatasetDto {
    @IsArray()
    @Type(type => String)
    fields: string[]

    @IsArray()
    @Type(type => String)
    tables: string[]
}
