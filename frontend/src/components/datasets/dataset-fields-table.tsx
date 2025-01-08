'use client'
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetDatasetFieldsApi } from "@/api/datasets";
import { useEffect } from "react";
import { AddDatasetFieldDialog } from "../front-page/dialogs/datasets/add-field-dialog";
import { SourceTable } from "@backend/source/entities/source-table.entity";
  
export default function DatasetFieldsTable({datasetId, usedTables}: {datasetId: string,usedTables: SourceTable[]}) {
    const {data: datasetFields,sendRequest:getDatasetFields} = useGetDatasetFieldsApi();
    useEffect(() => {
      getDatasetFields()(datasetId);
    },[])
  
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
              <TableHead>
                <AddDatasetFieldDialog tables={usedTables} onAddField={() => {getDatasetFields()(datasetId);}} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datasetFields && datasetFields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>{field.id}</TableCell>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.isSimple
                  ?field.sourceFields[0].sourceTable.name +'.'+field.sourceFields[0].name
                  :"f(x)"}</TableCell>
                <TableCell>{field.type}</TableCell>
                <TableCell>{field.aggregateType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    )
  }
  
