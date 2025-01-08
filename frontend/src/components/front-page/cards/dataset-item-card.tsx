import { useGetDatasetsApi } from "@/api/datasets";
import { Button } from "@/components/ui/button";
import { Card, CardContent,CardDescription,CardFooter,CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,  } from "@/components/ui/dropdown-menu";
import { Dataset } from "@backend/datasets/entities/dataset.entity";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { UpdateConnectionDialog } from "../dialogs/connections/update-connection-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";


interface ConnectionCardProps {
    dataset: Dataset,
    onEdit: () => void,
    onCreateNext: () => void,
    onDelete: () => void,
    getDatasets: ReturnType<typeof useGetDatasetsApi>['sendRequest']
  }
  
  export function DatasetItemCard({dataset, getDatasets, onEdit, onCreateNext,onDelete}: ConnectionCardProps) {
    const router = useRouter();
    const [open,setOpen] = useState(false);
    const markers = ["Based on: "+dataset.connection.name];
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dataset.name}</CardTitle>
            <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>Edit connection</DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete}>Delete connection</DropdownMenuItem>
                <DropdownMenuItem onClick={onCreateNext}>Create dataset</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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