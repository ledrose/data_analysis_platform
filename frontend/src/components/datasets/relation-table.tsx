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
  
  const RelationsTable = () => {
    const relations = [
      { name: "Users", joinType: "inner", field1: "id", field2: "user_id" },
      { name: "Orders", joinType: "left", field1: "id", field2: "order_id" },
      { name: "Products", joinType: "right", field1: "id", field2: "product_id" },
    ]
  
    return (
      <ScrollArea className="h-[300px] w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Name</TableHead>
              <TableHead>Join Type</TableHead>
              <TableHead>Field 1</TableHead>
              <TableHead>Field 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relations.map((relation, index) => (
              <TableRow key={index}>
                <TableCell>{relation.name}</TableCell>
                <TableCell>
                  <Select defaultValue={relation.joinType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select join type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inner">Inner Join</SelectItem>
                      <SelectItem value="left">Left Join</SelectItem>
                      <SelectItem value="right">Right Join</SelectItem>
                      <SelectItem value="full">Full Join</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{relation.field1}</TableCell>
                <TableCell>{relation.field2}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    )
  }
  
  export default RelationsTable