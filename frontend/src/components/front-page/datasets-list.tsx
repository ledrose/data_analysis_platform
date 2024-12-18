import { useGetDatasets } from "@/api/datasets"
import { ItemCard } from "./item-card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { use, useEffect } from "react"

const mockDatasets = [
  { id: 1, title: "Sales Data 2023", description: "Annual sales data for analysis" },
  { id: 2, title: "Customer Feedback", description: "Aggregated customer survey results" },
  { id: 3, title: "Product Inventory", description: "Current stock levels across all warehouses" },
  { id: 4, title: "Marketing Campaigns", description: "Performance metrics for all campaigns" },
  { id: 5, title: "Employee Performance", description: "Annual employee performance reviews" },
]

export function DatasetsList() {
    const {data,isLoading,sendRequest} = useGetDatasets();
    useEffect(() => {
        sendRequest()();
    },[])
    const handleAddDataset = () => {
        console.log("Add new dataset")
    }

    const handleEditDataset = (id: string) => {
        console.log(`Edit dataset ${id}`)
    }

    const handleCreateChart = (datasetId: string) => {
        console.log(`Create chart from dataset ${datasetId}`)
    }

    return (
        <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Datasets</h2>
            <Button onClick={handleAddDataset}>
            <Plus className="mr-2 h-4 w-4" /> Add Dataset
            </Button>
        </div>
        <div className="h-[150px] overflow-y-auto pr-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data && data.map((dataset) => (
                <ItemCard
                key={dataset.id}
                title={dataset.name}
                description={dataset.description}
                type="dataset"
                markers={["Based on: "+dataset.connection.name]}
                onEdit={() => handleEditDataset(dataset.id)}
                onCreateNext={() => handleCreateChart(dataset.id)}
                />
            ))}
            </div>
        </div>
        </div>
    )
}

