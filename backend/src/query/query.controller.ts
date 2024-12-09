import { Body, Controller, HttpCode, HttpStatus, NotImplementedException, Post } from '@nestjs/common';
import { ConnectionsService } from 'src/connections/connections.service';
import { QueryDatasetDto } from './dto/query-dataset.dto';
import { Auth } from 'src/auth/auth.decorator';

@Controller('query')
export class QueryController {

    @HttpCode(HttpStatus.OK)
    @Post('sql')
    async generateQuery(@Body() queryDto: QueryDatasetDto, @Auth() user: string) {
        throw new NotImplementedException()
    }

    @HttpCode(HttpStatus.OK)
    @Post('execute')
    async executeQuery(@Body() queryDto: QueryDatasetDto, @Auth() user: string) {
        throw new NotImplementedException()
    }

    

}
