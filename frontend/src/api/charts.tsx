import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";
import {Chart} from "@backend/charts/entities/chart.entity";


async function get_chart(chartId: string) {
    return request(`/api/charts/${chartId}`,"GET", {});
}

async function get_charts() {
    return request(`/api/charts/`,"GET", {});
}

export const useGetChartApi = () => useCustomFetch<Chart,typeof get_chart>(get_chart);
export const useGetChartsApi = () => useCustomFetch<Chart[],typeof get_charts>(get_charts);