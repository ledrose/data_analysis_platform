import { useGetDatasetsApi } from "@/api/datasets"
import { ItemCard } from "./cards/connection-item-card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { use, useEffect, useState } from "react"
import { DatasetItemCard } from "./cards/dataset-item-card"
import { AddDatasetDialog } from "./dialogs/datasets/add-dataset-dialog"
import { useGetConnectionsApi } from "@/api/connections"
import { useMainPageStore } from "@/_store/store"

export function DatasetsList() {
    const setUpdateDataset = useMainPageStore((store) => store.setUpdateDataset);
    const {data,isLoading,sendRequest:getDatasets} = useGetDatasetsApi();
    const {data:connections,sendRequest: getConnections} = useGetConnectionsApi();
    const useOpenHook = useState(false);
    useEffect(() => {
        getConnections()();
    },[])
    useEffect(() => {
        getDatasets()();
        setUpdateDataset(()=>getDatasets()());
    },[])

    const handleEditDataset = (id: string) => {
        console.log(`Edit dataset ${id}`)
    }

    const handleDeleteDataset = (id: string) => {
        console.log(`Delete dataset ${id}`)
    }

    const handleCreateChart = (datasetId: string) => {
        console.log(`Create chart from dataset ${datasetId}`)
    }

    return (
        <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Datasets</h2>
            <Button variant="default" onClick={() => useOpenHook[1](true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Dataset
            </Button>
            <AddDatasetDialog useOpenHook={useOpenHook} getDatasets={getDatasets}/>
        </div>
        <div className="h-[150px] overflow-y-auto pr-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data && data.map((dataset) => (
                <DatasetItemCard
                key={dataset.id}
                dataset={dataset}
                getDatasets={getDatasets}
                onEdit={() => handleEditDataset(dataset.id)}
                onCreateNext={() => handleCreateChart(dataset.id)}
                onDelete={() => handleDeleteDataset(dataset.id)}
                />
            ))}
            </div>
        </div>
        </div>
    )
}

