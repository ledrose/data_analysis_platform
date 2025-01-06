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
                <TableCell>
                  <Select defaultValue={field.type}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select defaultValue={field.aggregateType}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Select aggregation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="sum">Sum</SelectItem>
                      <SelectItem value="avg">Average</SelectItem>
                      <SelectItem value="count">Count</SelectItem>
                      <SelectItem value="min">Min</SelectItem>
                      <SelectItem value="max">Max</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    )
  }
  