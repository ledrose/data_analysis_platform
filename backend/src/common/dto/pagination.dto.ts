import { IsNumber, IsPositive } from "class-validator"

export class PaginationDto {
    @IsNumber()
    @IsPositive()
    limit: number

    @IsNumber()
    @IsPositive()
    page: number
}

export class PaginationResponseDto<T> {
    data: T
    isLastPage: boolean
}