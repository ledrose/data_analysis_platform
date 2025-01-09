import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";
import {Chart} from "@backend/charts/entities/chart.entity";
import {AddChartDto} from "@backend/charts/dto/add-chart.dto";

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

export const useGetChartApi = () => useCustomFetch<Chart,typeof get_chart>(get_chart);
export const useGetChartsApi = () => useCustomFetch<Chart[],typeof get_charts>(get_charts);
export const useAddChartApi = () => useCustomFetch<Chart,typeof add_chart>(add_chart);