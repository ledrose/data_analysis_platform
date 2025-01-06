'use client'
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetDatasetFieldsApi } from "@/api/datasets";
import { useEffect } from "react";
  
export default function DatasetFieldsTable({datasetId}: {datasetId: string}) {
    const {data: datasetFields,sendRequest:getDatasetFields} = useGetDatasetFieldsApi();
    useEffect(() => {
      getDatasetFields()(datasetId);
    },[])
    const fields = [
      { id: 1, name: "User ID", sourceField: "users.id", type: "number", aggregation: "none" },
      { id: 2, name: "Username", sourceField: "users.username", type: "string", aggregation: "none" },
      { id: 3, name: "Email", sourceField: "users.email", type: "string", aggregation: "none" },
      { id: 4, name: "Registration Date", sourceField: "users.created_at", type: "date", aggregation: "none" },
      { id: 5, name: "Total Orders", sourceField: "orders.id", type: "number", aggregation: "count" },
      { id: 6, name: "Total Spent", sourceField: "orders.total", type: "number", aggregation: "sum" },
      // Add more fields as needed
    ]
  
    return (
      <ScrollArea className="h-[calc(100vh-200px)] w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Source Field</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Aggregation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datasetFields && datasetFields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>{field.id}</TableCell>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.sourceFields[0].name}</TableCell>
                <TableCell>{field.type}</TableCell>
                <TableCell>{field.aggregateType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    )
  }
  