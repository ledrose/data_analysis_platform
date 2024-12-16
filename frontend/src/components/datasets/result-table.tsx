'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { ScrollArea } from "@/components/ui/scroll-area"
  
  const ResultsTable = () => {
    // Mock data for the results
    const columns = ["ID", "Name", "Email", "Order Total", "Product", "Category"]
    const rows = Array(10).fill(null).map((_, i) => [
      i + 1,
      `User ${i + 1}`,
      `user${i + 1}@example.com`,
      `$${(Math.random() * 1000).toFixed(2)}`,
      `Product ${i + 1}`,
      `Category ${(i % 3) + 1}`
    ])
  
    return (
      <ScrollArea className="h-full w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    )
  }
  
  export default ResultsTable
  
  