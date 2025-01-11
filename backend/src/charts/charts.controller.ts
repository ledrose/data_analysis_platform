import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AddChartDto } from './dto/add-chart.dto';
import { Auth } from 'src/auth/auth.decorator';
import { ChartsService } from './charts.service';
import { updateChartDto } from './dto/update-chart.dto';
import { ChartPropType, UpdateChartPropDto } from './dto/update-chart-prop.dto';

@Controller('charts')
export class ChartsController {
    constructor(
        private readonly chartsService: ChartsService
    ) {}

    @Post("create")
    @HttpCode(HttpStatus.CREATED)
    async createChart(@Body() addChartDto: AddChartDto, @Auth() user: string) {
        return await this.chartsService.createChart(addChartDto, user);      
    }

    @Post("update/:chart_id")
    @HttpCode(HttpStatus.OK)
    async updateChart(@Param("chart_id") chartId: string,@Auth() username: string,@Body() chartDro: updateChartDto) {
        return await this.chartsService.updateChart(chartId, username, chartDro);
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

    @Delete(":chart_id")
    @HttpCode(HttpStatus.OK)
    async deleteChart(@Param("chart_id") chartId: string,@Auth() user: string) {
        return await this.chartsService.deleteChart(chartId, user);
    }

    @Post(":chart_id/props")
    @HttpCode(HttpStatus.OK)
    async updateChartPropss(@Param("chart_id") chartId: string, @Body() propDto: UpdateChartPropDto, @Auth() user: string) {
        return await this.chartsService.updateChartProps(chartId, propDto.chartPropType, user, propDto);
    }

    @Delete(":chart_id/props/:type/:id")
    async deleteChartProps(@Param("chart_id") chartId: string, @Param("type") type: ChartPropType, @Param("id") fieldId: number) {
        return await this.chartsService.deleteChartProps(chartId, type, fieldId);
    }

}

