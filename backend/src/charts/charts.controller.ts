import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AddChartDto } from './dto/add-chart.dto';
import { Auth } from 'src/auth/auth.decorator';
import { ChartsService } from './charts.service';
import { updateChartDto } from './dto/update-chart.dto';

@Controller('charts')
export class ChartsController {
    constructor(
        private readonly chartsService: ChartsService
    ) {}

    @Post("create")
    @HttpCode(HttpStatus.CREATED)
    async createChart(@Body() addChartDto: AddChartDto, @Auth() user: string) {
        this.chartsService.createChart(addChartDto, user);      
    }

    @Post("update/:chart_id")
    @HttpCode(HttpStatus.OK)
    async updateChart(@Param("chart_id") chartId: string,@Auth() username: string,@Body() chartDro: updateChartDto) {
        await this.chartsService.updateChart(chartId, username, chartDro);
    }

    @Get(":chart_id")
    @HttpCode(HttpStatus.OK)
    async getChart(@Param("chart_id") chartId: string,@Auth() user: string) {
        return await this.chartsService.getChart(chartId,user);
    }

    @Get("")
    @HttpCode(HttpStatus.OK)
    async getCharts(@Auth() user: string) {
        return await this.chartsService.getCharts(user);
    }


}
