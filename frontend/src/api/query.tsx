import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";
import {PaginationDto} from "@backend/common/dto/pagination.dto";

async function execute_dataset_query(datasetId: string, paginationDto: PaginationDto = {offset: 0, limit: 10}) {
    return request(`/api/query/dataset/${datasetId}/execute`,"GET", {query_params: paginationDto});
}

export const useExecuteDatasetQuery = () => useCustomFetch<any[],typeof execute_dataset_query>(execute_dataset_query);
