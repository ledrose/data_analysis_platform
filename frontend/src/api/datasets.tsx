import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";
import { Dataset } from "@backend/datasets/entities/dataset.entity";
import { AddDatasetDto } from "@backend/datasets/dto/add-dataset.dto";
import { UpdateDatasetDto } from "@backend/datasets/dto/update-dataset.dto";
import { AddFieldDto, SourceFieldLocationDto} from "@backend/datasets/dataset-field/dto/add-field.dto"
import { UpdateFieldDto} from "@backend/datasets/dataset-field/dto/update-field.dto"
import { DatasetField } from "@backend/datasets/entities/dataset-field.entity";
import { AddBaseTableDto, AddJoinedTableDto } from "@backend/datasets/dataset-table/dto/add-table.dto"

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

async function get_dataset_fields(datasetId: string) {
    return request(`/api/datasets/${datasetId}/fields`,"GET", {});
}

async function get_dataset_field(datasetId: string, fieldId: number) {
    return request(`/api/datasets/${datasetId}/fields/${fieldId}`,"GET", {});
}

async function add_dataset_field(datasetId: string, dataset_dtos: AddFieldDto[]) {
    return request(`/api/datasets/${datasetId}/fields/create`,'POST', {
        body: dataset_dtos
    })
}

async function update_dataset_field(datasetId: string, fieldId: number, dataset_dto: UpdateFieldDto) {
    return request(`/api/datasets/${datasetId}/fields/${fieldId}/update`,'POST', {
        body: dataset_dto
    })
}

async function delete_dataset_field(datasetId: string, fieldId: number) {
    return request(`/api/datasets/${datasetId}/fields/${fieldId}/delete`,'POST', {});
}

async function add_base_table(datasetId: string, addTableDto: AddBaseTableDto) {
    return request(`/api/datasets/${datasetId}/table/create_base`,'POST', {
        body: addTableDto
    })
}


async function add_joined_table(datasetId: string, addTableDto: AddJoinedTableDto) {
    return request(`/api/datasets/${datasetId}/table/create_joined`,'POST', {
        body: addTableDto
    })
}

async function delete_table(datasetId: string,tableId: number,) {
    return request(`/api/datasets/${datasetId}/table/delete/${tableId}`,'DELETE', {});
}

export const useGetDatasetApi = () => useCustomFetch<Dataset,typeof get_dataset>(get_dataset);
export const useGetDatasetsApi = () => useCustomFetch<Dataset[],typeof get_datasets>(get_datasets);
export const useCreateDatasetApi = () => useCustomFetch<Dataset,typeof create_dataset>(create_dataset);
export const useUpdateDatasetApi = () => useCustomFetch<Dataset,typeof update_dataset>(update_dataset);
export const useDeleteDatasetApi = () => useCustomFetch<Dataset,typeof delete_dataset>(delete_dataset);

export const useGetDatasetFieldsApi = () => useCustomFetch<DatasetField[],typeof get_dataset_fields>(get_dataset_fields);
export const useGetDatasetFieldApi = () => useCustomFetch<DatasetField,typeof get_dataset_field>(get_dataset_field);
export const useAddDatasetFieldApi = () => useCustomFetch<DatasetField[],typeof add_dataset_field>(add_dataset_field);
export const useUpdateDatasetFieldApi = () => useCustomFetch<DatasetField,typeof update_dataset_field>(update_dataset_field);
export const useDeleteDatasetFieldApi = () => useCustomFetch<DatasetField,typeof delete_dataset_field>(delete_dataset_field);

export const useAddBaseTableApi = () => useCustomFetch<void,typeof add_base_table>(add_base_table);
export const useAddJoinedTableApi = () => useCustomFetch<void,typeof add_joined_table>(add_joined_table);
export const useDeleteTableApi = () => useCustomFetch<void,typeof delete_table>(delete_table);