import useCustomFetch from "@/_helpers/CustomFetchHook";
import request from "@/_helpers/FetchHelper";
import {Connection,ConnectionType} from "@backend/connections/entities/connection.entity";
import {ConnectionDto} from "@backend/connections/dto/connection.dto";

// enum ConnectionType {
//     POSTGRESQL = "pg",
//     MYSQL = "mysql",
// }
// interface ConnctionRequest {
//     name: string    
//     type: ConnectionType
//     host: string
//     port: number
//     username: string
//     password: string
//     database: string
//     schema?: string
// }

// interface ConnectionResponse {
//     id: string
//     name: string
//     type: ConnectionType
//     host: string
//     port: number
//     username: string
//     // password: string
//     database: string
//     schema?: string
//     // user: User
//     // datasets: Dataset[]

// }

async function connection_create_api(value: ConnectionDto) {
    return request("/api/connections/create","POST", {
        body: value
    });
}

async function get_connections_api() {
    return request("/api/connections/create","GET",{});
}


async function get_connection_api(id: string) {
    return request("/api/connections","GET",{
        query_params: {
            id
        }
    });
}

export const useGetConnectionsApi = () => useCustomFetch<Connection[],typeof get_connections_api>(get_connections_api);
export const useGetConnectionApi = () => useCustomFetch<Connection,typeof get_connection_api>(get_connection_api);
export const useCreateConnectionApi = () => useCustomFetch<Connection,typeof connection_create_api>(connection_create_api);