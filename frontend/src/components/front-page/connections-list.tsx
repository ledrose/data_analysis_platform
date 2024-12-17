import { useGetConnectionsApi } from "@/api/connections"
import { ItemCard } from "./item-card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useEffect } from "react"

export function ConnectionsList() {
    const {data,isLoading,sendRequest} = useGetConnectionsApi();
    useEffect(() => {
        sendRequest();
    },[])
    const handleAddConnection = () => {
        console.log("Add new connection")
    }

    const handleEditConnection = (id: string) => {
        console.log(`Edit connection ${id}`)
    }

    const handleCreateDataset = (connectionId: string) => {
        console.log(`Create dataset from connection ${connectionId}`)
    }

    return (
        <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Connections</h2>
            <Button onClick={handleAddConnection}>
                <Plus className="mr-2 h-4 w-4" /> Add Connection
            </Button>
        </div>
        <div className="h-[160px] overflow-y-auto pr-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data && data.map((connection) => (
                <ItemCard
                key={connection.id}
                title={connection.name}
                description={connection.description}
                type="connection"
                markers={[connection.type,...(connection.schema ? [connection.schema] : [])]}
                onEdit={() => handleEditConnection(connection.id)}
                onCreateNext={() => handleCreateDataset(connection.id)}
                />
            ))}
            </div>
        </div>
        </div>
    )
}

