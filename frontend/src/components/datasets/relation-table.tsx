'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  import { ScrollArea } from "@/components/ui/scroll-area"
  import { DatasetJoin } from "@backend/datasets/entities/dataset-join.entity"
  import {SourceTable} from "@backend/source/entities/source-table.entity"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { useDeleteDatasetFieldApi, useDeleteTableApi } from "@/api/datasets"
import { useDatasetStore } from "@/_store/store"
  const RelationsTable = ({relations,tables}:{relations: DatasetJoin[] | undefined,tables: SourceTable[] | undefined}) => {
    const {datasetId,updateDataset} = useDatasetStore();
    const {sendRequest} = useDeleteTableApi();

    const baseTable: SourceTable | undefined = tables && tables[0];
    // relations && relations[0]?.rightSourceField.sourceTable;
  
    return (
      <ScrollArea className="h-[300px] w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Name 1</TableHead>
              <TableHead>Field Name 1</TableHead>
              <TableHead>Join Type</TableHead>
              <TableHead>Table Name 2</TableHead>
              <TableHead>Field Name 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {baseTable && (
              <TableRow key={-1}>
                <TableCell>{baseTable.name}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                    <DeleteRelationDialog
                      relationName={baseTable.name}
                      onDeleteRelation={() => {sendRequest({onData: updateDataset})(datasetId,baseTable.id)}}
                    />
                </TableCell>
              </TableRow>
            )
            }
            {relations && relations.map((relation, index) => (
              <TableRow key={index}>
                <TableCell>{relation.leftSourceField.sourceTable.name}</TableCell>
                <TableCell>{relation.leftSourceField.name}</TableCell>
                <TableCell>{relation.type}</TableCell>
                <TableCell>{relation.rightSourceField.sourceTable.name}</TableCell>
                <TableCell>{relation.rightSourceField.name}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => {}} className="mr-2">
                      Edit
                    </Button>
                    <DeleteRelationDialog
                      relationName={relation.leftSourceField.sourceTable.name + '-' + relation.rightSourceField.sourceTable.name}
                      onDeleteRelation={() => {sendRequest({onData: updateDataset})(datasetId,relation.leftSourceField.sourceTable.id)}}
                    />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    )
  }
  
  interface DeleteRelationDialogProps {
    relationName: string
    onDeleteRelation: () => void
  }
  

  function DeleteRelationDialog({ relationName, onDeleteRelation }: DeleteRelationDialogProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Relation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the relation {relationName}? This action is irreversible and may affect other parts of your dataset.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="destructive" onClick={onDeleteRelation}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  

  export default RelationsTable