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
  const RelationsTable = ({relations,tables}:{relations: DatasetJoin[] | undefined,tables: SourceTable[] | undefined}) => {
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    )
  }
  
  export default RelationsTable