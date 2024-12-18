import { useCreateConnectionApi, useDeleteConnectionApi, useGetConnectionsApi, useUpdateConnectionApi } from "@/api/connections"
import { ConnectionItemCard, ItemCard } from "./item-card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useEffect } from "react"
import { AddConnectionDialog } from "./connections/add-connection-dialog"

export function ConnectionsList() {
    const {data,isLoading,sendRequest:getConnections} = useGetConnectionsApi();
    const useCreateConnection = useCreateConnectionApi();
    const {sendRequest: createConnection} = useCreateConnection;

    const {} = useUpdateConnectionApi();
    const {sendRequest:deleteConnection} = useDeleteConnectionApi();
    useEffect(() => {
        getConnections()();
    },[])



    const handleEditConnection = (id: string) => {
        console.log(`Edit connection ${id}`)
    }

    const handleDeleteConnection = (id: string) => {
        console.log(`Delete connection ${id}`)
        deleteConnection({
            onData: (_) => {
                getConnections()();
            }
        })(id);
    }

    const handleCreateDataset = (connectionId: string,) => {
        console.log(`Create dataset from connection ${connectionId}`)
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
                    onEdit={() => handleEditConnection(connection.id)}
                    onCreateNext={() => handleCreateDataset(connection.id)}
                    onDelete={() => handleDeleteConnection(connection.id)}
                    getConnections={getConnections}
                />
                // <ItemCard
                // key={connection.id}
                // title={connection.name}
                // description={connection.description}
                // type="connection"
                // markers={[connection.type,...(connection.schema ? [connection.schema] : [])]}
                // onEdit={() => handleEditConnection(connection.id)}
                // onCreateNext={() => handleCreateDataset(connection.id)}
                // onDelete={() => handleDeleteConnection(connection.id)}
                // />
            ))}
            </div>
        </div>
        </div>
    )
}

