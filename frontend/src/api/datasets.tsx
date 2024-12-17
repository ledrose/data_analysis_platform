import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";
import { Dataset } from "@backend/datasets/entities/dataset.entity";

async function get_dataset(datasetId: string) {
    return request(`/api/datasets/${datasetId}`,"GET", {});
}


async function get_datasets() {
    return request(`/api/datasets/`,"GET", {});
}


export const useGetDataset = () => useCustomFetch<Dataset,typeof get_dataset>(get_dataset);
export const useGetDatasets = () => useCustomFetch<Dataset[],typeof get_datasets>(get_datasets);