import { useGetChartsApi } from "@/api/charts";
import { ItemCard } from "./cards/connection-item-card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useEffect } from "react";
import { AddConnectionDialog } from "./dialogs/connections/add-connection-dialog";
import { AddChartDialog } from "./dialogs/charts/chart-dialogs";
import { useMainPageStore } from "@/_store/store";
import { ChartItemCard } from "./cards/chart-item-card";

const mockCharts = [
  { id: 1, title: "Monthly Revenue", description: "Bar chart showing revenue by month" },
  { id: 2, title: "Customer Satisfaction", description: "Pie chart of satisfaction ratings" },
  { id: 3, title: "Product Sales Comparison", description: "Line chart comparing top products" },
  { id: 4, title: "Website Traffic", description: "Area chart of daily website visitors" },
  { id: 5, title: "Inventory Turnover", description: "Scatter plot of inventory turnover rates" },
]

export function ChartsList() {
    const setUpdateChart = useMainPageStore((store) => store.setUpdateChart);
    const {data,isLoading,sendRequest} = useGetChartsApi();
    useEffect(() => {
        setUpdateChart(() => sendRequest()());
        sendRequest()();
    },[])
    return (
        <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Charts</h2>
            <AddChartDialog>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Chart
                </Button>
            </AddChartDialog>
            
        </div>
        <div className="h-[170px] overflow-y-auto pr-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data && data.map((chart) => (
                <ChartItemCard
                    key={chart.id}
                    chart={chart}
                />
            ))}
            </div>
        </div>
        </div>
    )
}

