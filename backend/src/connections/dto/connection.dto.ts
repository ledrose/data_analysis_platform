import { IsDecimal, IsEnum, IsInt, IsNumber, IsString } from "class-validator"
import { ConnectionType } from "../entities/connection.entity"

export class ConnectionDto {
    @IsString()
    name: string
    
    @IsEnum(ConnectionType)
    type: ConnectionType

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
}
