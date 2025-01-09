import { useGetDatasetsApi } from "@/api/datasets";
import { Button } from "@/components/ui/button";
import { Card, CardContent,CardDescription,CardFooter,CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,  } from "@/components/ui/dropdown-menu";
import { Dataset } from "@backend/datasets/entities/dataset.entity";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateDatasetDialog } from "../dialogs/datasets/update-dataset-dialog";
import { AddChartDialog, UpdateChartDialog } from "../dialogs/charts/chart-dialogs";
import { useMainPageStore } from "@/_store/store";
import { Chart } from "@backend/charts/entities/chart.entity";
import { DeleteDialog } from "@/components/common/delete-comfirmation";
import { useDeleteChartApi } from "@/api/charts";


interface ConnectionCardProps {
    chart: Chart
}
  
  export function ChartItemCard({chart}: ConnectionCardProps) {
    const router = useRouter();
    const updateCharts = useMainPageStore(state => state.updateChart);
    const {sendRequest:deleteChart} = useDeleteChartApi();
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const markers = ["Based on: "+chart.dataset.name];
    const onDelete = () => {
      deleteChart({onData: updateCharts})(chart.id)
    }
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{chart.name}</CardTitle>
            <DropdownMenu modal={false} open={isDropdownMenuOpen} onOpenChange={setIsDropdownMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                setIsUpdateDialogOpen(true)
                setIsDropdownMenuOpen(false)
              }}>Edit chart</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                setIsDeleteDialogOpen(true)
                setIsDropdownMenuOpen(false)
              }}>Delete chart</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteDialog title="Delete chart" text="Are you sure you want to delete the chart?" onDeleteRelation={onDelete} useOpenHook={[isDeleteDialogOpen,setIsDeleteDialogOpen]}/>
            <UpdateChartDialog useOpenHook={[isUpdateDialogOpen, setIsUpdateDialogOpen]} chartInfo={chart}/>
        </CardHeader>
        <CardContent>
          <CardDescription>{chart.description}</CardDescription>
          <div className="flex flex-row justify-between">
            <div className="mt-2">
                {markers.map((marker, index) =>
                        <span key={index} className={`inline-flex items-center rounded-md px-2 py-1 me-2 text-xs font-medium bg-purple-100 text-purple-700`}>
                          {marker.charAt(0).toUpperCase() + marker.slice(1)}
                        </span>
                )}
            </div>
            <Button variant="default" onClick={() => {
              router.push(`/charts?id=${chart.id}`)
            }}>View</Button>
          </div>
        </CardContent>
      </Card>
    )
  }