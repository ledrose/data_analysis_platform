import { useCreateConnectionApi, useDeleteConnectionApi, useGetConnectionsApi, useUpdateConnectionApi } from "@/api/connections"
import { ConnectionItemCard, ItemCard } from "./cards/connection-item-card"
import { useEffect } from "react"
import { AddConnectionDialog } from "./dialogs/connections/add-connection-dialog"
import { useGetDatasetsApi } from "@/api/datasets"

export function ConnectionsList() {
    const {data,isLoading,sendRequest:getConnections} = useGetConnectionsApi();
    const {sendRequest:getDatasets} = useGetDatasetsApi();
    const {sendRequest:deleteConnection} = useDeleteConnectionApi();
    useEffect(() => {
        getConnections()();
    },[])


    const handleDeleteConnection = (id: string) => {
        console.log(`Delete connection ${id}`)
        deleteConnection({
            onData: (_) => {
                getConnections()();
            }
        })(id);
    }

    return (
        <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Connections</h2>
            <AddConnectionDialog getConnections={getConnections}/>
        </div>
        <div className="h-[160px] overflow-y-auto pr-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data && data.map((connection) => (
                <ConnectionItemCard 
                    key={connection.id}
                    connection={connection}
                    onDelete={() => handleDeleteConnection(connection.id)}
                    getDatasets={getDatasets}
                    getConnections={getConnections}
                />
            ))}
            </div>
        </div>
        </div>
    )
}

