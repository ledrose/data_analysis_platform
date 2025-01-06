import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UpdateConnectionDialog } from "../dialogs/connections/update-connection-dialog"
import { Connection } from "@backend/connections/entities/connection.entity"
import { useGetConnectionsApi } from "@/api/connections"
import { useState } from "react"
import { AddDatasetDialog } from "../dialogs/datasets/add-dataset-dialog"
import { useGetDatasetsApi } from "@/api/datasets"

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
  // onEdit: () => void,
  // onCreateNext: () => void,
  onDelete: () => void,
  getConnections: ReturnType<typeof useGetConnectionsApi>['sendRequest'],
  getDatasets: ReturnType<typeof useGetDatasetsApi>['sendRequest']
}


export function ConnectionItemCard({connection, getConnections, getDatasets, onDelete}: ConnectionCardProps) {
	const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
	const [isNextDialogOpen, setIsNextDialogOpen] = useState(false);

  const markers = [connection.type,...(connection.schema ? [connection.schema] : [])];
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{connection.name}</CardTitle>
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
              }}>Edit connection</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>Delete connection</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setIsNextDialogOpen(true)
                setIsDropdownMenuOpen(false)
              }}>Create dataset</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        <UpdateConnectionDialog useOpenHook={[isUpdateDialogOpen, setIsUpdateDialogOpen]} connectionId={connection.id} connectionInfo={connection} getConnections={getConnections} />
        <AddDatasetDialog useOpenHook={[isNextDialogOpen, setIsNextDialogOpen]} getDatasets={getDatasets} defaultConnection={connection}/>
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