'use client'
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDeleteDatasetFieldApi, useGetDatasetFieldsApi } from "@/api/datasets";
import { useEffect } from "react";
import { AddDatasetFieldDialog, formSchema, UpdateDatasetFieldDialog } from "../front-page/dialogs/datasets/field-dialog";
import { SourceTable } from "@backend/source/entities/source-table.entity";
import { Button } from "../ui/button";
import { useDatasetStore } from "@/_store/store";
import * as z from "zod"
import { DatasetField } from "@backend/datasets/entities/dataset-field.entity";
import { SourceField } from "@backend/source/entities/source-field.entity";
  

function formatApiToUiType(field: DatasetField): z.infer<typeof formSchema> {
  if (field?.formula?.length > 0) {
    for (let i = 0; i < field.sourceFields.length; i++) {
      field.formula = field.formula.replaceAll("${"+i+"}",`\$\{${field.sourceFields[i].sourceTable.name}.${field.sourceFields[i].name}\}`);
    }
    field.formula = field.formula.replaceAll('"',"'");
  }
  return {
    name: field.name,
    type: field.type,
    aggregation: field.aggregateType,
    fieldType: field.isSimple ? "source" : "calculated",
    sourceTable: field.isSimple ? field.sourceFields.length==0 ? null :field.sourceFields[0].sourceTable.name : "",
    sourceField: field.isSimple ? field.sourceFields.length==0 ? null : field.sourceFields[0].name : "",
    formula: field.isSimple ? "" : field.formula
  }
}

export default function DatasetFieldsTable({datasetId, usedTables}: {datasetId: string,usedTables: SourceTable[]}) {
    const {data: datasetFields,sendRequest:getDatasetFields} = useGetDatasetFieldsApi();
    const updateDataset = useDatasetStore((store) => store.updateDataset);
    const {sendRequest:deleteDatasetField} = useDeleteDatasetFieldApi();
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
                <AddDatasetFieldDialog tables={usedTables} onAddField={() => {getDatasetFields()(datasetId)}}>
                  <Button>Add Field</Button>
                </AddDatasetFieldDialog>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {datasetFields && datasetFields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>{field.id}</TableCell>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.isSimple
                  ? field.sourceFields.length==0 
                    ? "Error" 
                    :field.sourceFields[0].sourceTable.name +'.'+field.sourceFields[0].name
                  :"f(x)"}</TableCell>
                <TableCell>{field.type}</TableCell>
                <TableCell>{field.aggregateType}</TableCell>
                <TableCell>
                    <UpdateDatasetFieldDialog fieldId={field.id} tables={usedTables} onAddField={() => {getDatasetFields()(datasetId)}} defaultValues={
                      formatApiToUiType(field)
                    }> 
                      <Button variant="outline" size="sm" className="mr-2">
                        Edit
                      </Button>
                    </UpdateDatasetFieldDialog>
                    <Button variant="destructive" size="sm" onClick={() => {deleteDatasetField({
                      onData: () => {updateDataset(); getDatasetFields()(datasetId)}
                    })(datasetId,field.id)}} className="mr-2">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    )
  }
  
