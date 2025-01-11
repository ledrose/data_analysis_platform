import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";
import {Chart} from "@backend/charts/entities/chart.entity";
import {AddChartDto} from "@backend/charts/dto/add-chart.dto";
import {ChartPropType, UpdateChartPropDto} from "@backend/charts/dto/update-chart-prop.dto";
import {UpdateChartDto} from "@backend/charts/dto/update-chart.dto";
async function get_chart(chartId: string) {
    return request(`/api/charts/${chartId}`,"GET", {});
}

async function get_charts() {
    return request(`/api/charts/`,"GET", {});
}

async function add_chart(chart: AddChartDto) {
    return request('/api/charts/create','POST', {
        body: chart
    })
}

async function update_chart(chartId: string, chart: UpdateChartDto) {
    return request(`/api/charts/update/${chartId}`,"POST", {
        body: chart
    })
}

async function delete_chart(chartId: string) {
    return request(`/api/charts/${chartId}`,"DELETE", {});
}

async function update_chart_props(chartId: string, type: ChartPropType, propDto: {id: number}) {
    return request(`/api/charts/${chartId}/props/`,"POST", {
        body: {
            chartPropType: type,
            ...propDto
        }
    })
}

async function delete_chart_props(chartId: string, type: ChartPropType, fieldId: number) {
    return request(`/api/charts/${chartId}/props/${type}/${fieldId}`,"DELETE", {});
}
    
interface ChartProp {
    fieldId: number;
    chartId: string;
}


export const useGetChartApi = () => useCustomFetch<Chart,typeof get_chart>(get_chart);
export const useGetChartsApi = () => useCustomFetch<Chart[],typeof get_charts>(get_charts);
export const useAddChartApi = () => useCustomFetch<Chart,typeof add_chart>(add_chart);
export const useUpdateChartApi = () => useCustomFetch<Chart,typeof update_chart>(update_chart);
export const useDeleteChartApi = () => useCustomFetch<Chart,typeof delete_chart>(delete_chart);
export const useUpdateChartPropsApi = () => useCustomFetch<ChartProp,typeof update_chart_props>(update_chart_props);
export const useDeleteChartPropsApi = () => useCustomFetch<ChartProp,typeof delete_chart_props>(delete_chart_props);