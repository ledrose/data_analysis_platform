import { useDeleteDatasetApi, useGetDatasetsApi } from "@/api/datasets";
import { Button } from "@/components/ui/button";
import { Card, CardContent,CardDescription,CardFooter,CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,  } from "@/components/ui/dropdown-menu";
import { Dataset } from "@backend/datasets/entities/dataset.entity";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateDatasetDialog } from "../dialogs/datasets/update-dataset-dialog";
import { AddChartDialog } from "../dialogs/charts/chart-dialogs";
import { useMainPageStore } from "@/_store/store";
import { DeleteDialog } from "@/components/common/delete-comfirmation";


interface ConnectionCardProps {
    dataset: Dataset,
    // onDelete: () => void,
}
  
  export function DatasetItemCard({dataset}: ConnectionCardProps) {
    const router = useRouter();
    const {sendRequest:deleteDataset} = useDeleteDatasetApi();
    const updateDataset = useMainPageStore(state => state.updateDataset);

    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isNextDialogOpen, setIsNextDialogOpen] = useState(false);
    const markers = ["Based on: "+dataset.connection.name];
    const onDelete = () => {
      deleteDataset({onData: updateDataset})(dataset.id)
    }
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dataset.name}</CardTitle>
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
              }}>Edit dataset</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                setIsDeleteDialogOpen(true)
                setIsDropdownMenuOpen(false)
              }}>Delete dataset</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                setIsNextDialogOpen(true)
                setIsDropdownMenuOpen(false)
              }}>Create chart</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <UpdateDatasetDialog useOpenHook={[isUpdateDialogOpen, setIsUpdateDialogOpen]} dataset={dataset} />
            <DeleteDialog title="Delete dataset" text="Are you sure you want to delete the dataset?" onDeleteRelation={onDelete} useOpenHook={[isDeleteDialogOpen,setIsDeleteDialogOpen]}/>
            <AddChartDialog defaultDataset={dataset} useOpenHook={[isNextDialogOpen, setIsNextDialogOpen]}/>
        </CardHeader>
        <CardContent>
          <CardDescription>{dataset.description}</CardDescription>
          <div className="flex flex-row justify-between">
            <div className="mt-2">
                {markers.map((marker, index) =>
                        <span key={index} className={`inline-flex items-center rounded-md px-2 py-1 me-2 text-xs font-medium bg-green-100 text-green-700`}>
                          {marker.charAt(0).toUpperCase() + marker.slice(1)}
                        </span>
                )}
            </div>
            <Button variant="default" onClick={() => {
              router.push(`/datasets?id=${dataset.id}`)
            }}>View</Button>
          </div>
        </CardContent>
      </Card>
    )
  }