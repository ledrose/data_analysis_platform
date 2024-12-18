import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";
import { Dataset } from "@backend/datasets/entities/dataset.entity";
import { AddDatasetDto } from "@backend/datasets/dto/add-dataset.dto";
import { UpdateDatasetDto } from "@backend/datasets/dto/update-dataset.dto";


async function get_dataset(datasetId: string) {
    return request(`/api/datasets/${datasetId}`,"GET", {});
}


async function get_datasets() {
    return request(`/api/datasets/`,"GET", {});
}

async function create_dataset(datasetDto: AddDatasetDto) {
    return request('/api/datasets/create','POST', {
        body: datasetDto
    })
}

async function update_dataset(datasetId: string, datasetDto: UpdateDatasetDto) {
    return request('/api/datasets/update/' + datasetId,'POST', {
        body: datasetDto
    })
}

async function delete_dataset(datasetId: string) {
    return request('/api/datasets/delete/' + datasetId,'POST', {});
}

export const useGetDatasetApi = () => useCustomFetch<Dataset,typeof get_dataset>(get_dataset);
export const useGetDatasetsApi = () => useCustomFetch<Dataset[],typeof get_datasets>(get_datasets);
export const useCreateDatasetApi = () => useCustomFetch<Dataset,typeof create_dataset>(create_dataset);
export const useUpdateDatasetApi = () => useCustomFetch<Dataset,typeof update_dataset>(update_dataset);
export const useDeleteDatasetApi = () => useCustomFetch<Dataset,typeof delete_dataset>(delete_dataset);