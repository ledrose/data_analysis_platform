'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useExecuteDatasetQuery } from "@/api/query"
  
  const ResultsTable = ({queryResults}: {queryResults: any[] | null}) => {
    const columns = queryResults && Object.getOwnPropertyNames(queryResults[0]);
  
    return (
      <ScrollArea className="h-full w-full border rounded-md">
        <Table >
          <TableHeader>
            <TableRow>
              {columns && columns.map((column: string, index) => (
                <TableHead key={index}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryResults && queryResults.map((row: Object, rowIndex: number) => (
              <TableRow key={rowIndex}>
                {
                  Object.entries(row).map(([key, value],cellIndex) => (
                    <TableCell key={cellIndex}>{value}</TableCell>
                  ))
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
  }
  
  export default ResultsTable
  
  