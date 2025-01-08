import { IsArray, IsDecimal, IsEnum, IsInt, IsNumber, IsOptional, IsString, ValidateNested, ValidatePromise } from "class-validator"
import { ConnectionType } from "../entities/connection.entity"
import { Type } from "class-transformer"

export class ConnectionDto {
    @IsString()
    name: string
    
    @IsEnum(ConnectionType)
    type: ConnectionType

    @IsString()
    description: string

    @IsString()
    host: string

    @IsNumber()
    port: number

    @IsString()
    username: string

    @IsString()
    password: string

    @IsString()   
    database: string

    // @IsArray()
    // @ValidateNested()
    // @Type(type => String)
    @IsString()
    @IsOptional()
    schema?: string
}
