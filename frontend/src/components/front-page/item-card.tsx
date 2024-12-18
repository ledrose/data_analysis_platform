import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UpdateConnectionDialog } from "./connections/add-connection-dialog"
import { Connection } from "@backend/connections/entities/connection.entity"
import { UpdateConnectionDto } from "@backend/connections/dto/update-connection.dto"
import { DialogTrigger } from "../ui/dialog"
import { useGetConnectionsApi } from "@/api/connections"
import { useState } from "react"

interface ItemCardProps {
  title: string,
  description: string,
  type: 'connection' | 'dataset' | 'chart',
  markers?: string[],
  onEdit: () => void
  onCreateNext: () => void,
  onDelete: () => void,
}

export function ItemCard({ title, description, type, markers = [], onEdit, onCreateNext, onDelete }: ItemCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit {type}</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>Delete {type}</DropdownMenuItem>
            <DropdownMenuItem onClick={onCreateNext}>
              Create {type === 'connection' ? 'dataset' : 'chart'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <div className="mt-2">
            {markers.map((marker, index) =>
                    <span key={index} className={`inline-flex items-center rounded-md px-2 py-1 me-2 text-xs font-medium ${
                    type === 'connection' ? 'bg-blue-100 text-blue-700' :
                    type === 'dataset' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                    }`}>
                    {marker.charAt(0).toUpperCase() + marker.slice(1)}
                    </span>
            )}
        </div>
      </CardContent>
    </Card>
  )
}


interface ConnectionCardProps {
  connection: Connection,
  onEdit: () => void,
  onCreateNext: () => void,
  onDelete: () => void,
  getConnections: ReturnType<typeof useGetConnectionsApi>['sendRequest']
}

export function ConnectionItemCard({connection, getConnections, onEdit, onCreateNext,onDelete}: ConnectionCardProps) {
  const [open,setOpen] = useState(false);
  console.log(open);
  const markers = [connection.type,...(connection.schema ? [connection.schema] : [])];
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{connection.name}</CardTitle>
        <UpdateConnectionDialog connectionId={connection.id} connectionInfo={connection} getConnections={getConnections}>
          <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem onClick={onEdit}>Edit connection</DropdownMenuItem>
              </DialogTrigger>  
              <DropdownMenuItem onClick={onDelete}>Delete connection</DropdownMenuItem>
              <DropdownMenuItem onClick={onCreateNext}>Create dataset</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </UpdateConnectionDialog>
      </CardHeader>
      <CardContent>
        <CardDescription>{connection.description}</CardDescription>

        <div className="mt-2">
            {markers.map((marker, index) =>
                    <span key={index} className={`inline-flex items-center rounded-md px-2 py-1 me-2 text-xs font-medium bg-blue-100 text-blue-700`}>
                      {marker.charAt(0).toUpperCase() + marker.slice(1)}
                    </span>
            )}
        </div>
      </CardContent>
    </Card>
  )
}