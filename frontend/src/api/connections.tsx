import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";
import {Connection,ConnectionType} from "@backend/connections/entities/connection.entity";
import {ConnectionDto} from "@backend/connections/dto/connection.dto";

async function connection_create_api(value: ConnectionDto) {
    return request("/api/connections/create","POST", {
        body: value
    });
}

async function get_connection_api(id: string) {
    return request("/api/connections/"+id,"GET",{});
}


async function get_connections_api() {
    return request("/api/connections","GET",{});
}

export const useGetConnectionsApi = () => useCustomFetch<Connection[],typeof get_connections_api>(get_connections_api);
export const useGetConnectionApi = () => useCustomFetch<Connection,typeof get_connection_api>(get_connection_api);
export const useCreateConnectionApi = () => useCustomFetch<Connection,typeof connection_create_api>(connection_create_api);