import { useGetChartsApi } from "@/api/charts";
import { ItemCard } from "./item-card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useEffect } from "react";

const mockCharts = [
  { id: 1, title: "Monthly Revenue", description: "Bar chart showing revenue by month" },
  { id: 2, title: "Customer Satisfaction", description: "Pie chart of satisfaction ratings" },
  { id: 3, title: "Product Sales Comparison", description: "Line chart comparing top products" },
  { id: 4, title: "Website Traffic", description: "Area chart of daily website visitors" },
  { id: 5, title: "Inventory Turnover", description: "Scatter plot of inventory turnover rates" },
]

export function ChartsList() {
    const {data,isLoading,sendRequest} = useGetChartsApi();
    useEffect(() => {
        sendRequest(); 
    },[])
    const handleAddChart = () => {
        console.log("Add new chart")
    }

    const handleEditChart = (id: string) => {
        console.log(`Edit chart ${id}`)
    }

    const handleCreateNext = (chartId: string) => {
        console.log(`Create next item based on chart ${chartId}`)
    }

    return (
        <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Charts</h2>
            <Button onClick={handleAddChart}>
            <Plus className="mr-2 h-4 w-4" /> Add Chart
            </Button>
        </div>
        <div className="h-[170px] overflow-y-auto pr-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data && data.map((chart) => (
                <ItemCard
                key={chart.id}
                title={chart.name}
                description={chart.description}
                type="chart"
                markers={["Based on: "+chart.dataset.name]}
                onEdit={() => handleEditChart(chart.id)}
                onCreateNext={() => handleCreateNext(chart.id)}
                />
            ))}
            </div>
        </div>
        </div>
    )
}

