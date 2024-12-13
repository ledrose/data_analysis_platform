import { Body, Controller, Post } from '@nestjs/common';
import { AddChartDto } from './dto/add-chart.dto';
import { Auth } from 'src/auth/auth.decorator';
import { ChartsService } from './charts.service';

@Controller('charts')
export class ChartsController {
    constructor(
        private readonly chartsService: ChartsService
    ) {}

    @Post("create")
    async createChart(@Body() addChartDto: AddChartDto, @Auth() user: string) {
        this.chartsService.createChart(addChartDto, user);   
        
    }


}
