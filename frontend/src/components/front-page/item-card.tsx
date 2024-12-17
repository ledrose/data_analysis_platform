import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ItemCardProps {
  title: string,
  description: string,
  type: 'connection' | 'dataset' | 'chart',
  markers?: string[],
  onEdit: () => void
  onCreateNext: () => void
}

export function ItemCard({ title, description, type, markers = [], onEdit, onCreateNext }: ItemCardProps) {
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

