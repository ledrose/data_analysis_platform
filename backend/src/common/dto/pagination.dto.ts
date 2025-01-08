import { IsNumber, IsPositive, Min } from "class-validator"

export class PaginationDto {
    @IsNumber()
    @IsPositive()
    limit: number;

    @IsNumber()
    @Min(0) 
    offset: number;
}

export class PaginationResponseDto<T> {
    data: T
    isLastPage: boolean
}