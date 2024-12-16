'use client'
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

const SearchSidebar = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  // Mock data for tables and columns
  const tables = ["Users", "Orders", "Products", "Categories"]
  const columns = new Map([
    ["Users", ["id", "name", "email", "created_at"]],
    ["Orders", ["id", "user_id", "total", "status", "created_at"]],
    ["Products", ["id", "name", "price", "category_id"]],
    ["Categories", ["id", "name"]]
  ])

  return (
    <div className="w-64 bg-gray-100 p-4 flex flex-col h-full overflow-hidden">
      <h2 className="text-lg font-semibold mb-2">Available Tables</h2>
      <ScrollArea className="flex-grow mb-4">
        <ul>
          {tables.map(table => (
            <li
              key={table}
              className={`cursor-pointer p-2 rounded ${selectedTable === table ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedTable(table)}
            >
              {table}
            </li>
          ))}
        </ul>
      </ScrollArea>
      
      <h2 className="text-lg font-semibold mb-2">Columns</h2>
      <ScrollArea className="flex-grow">
        <ul>
          {selectedTable && columns.get(selectedTable)!.map(column => (
            <li key={column} className="p-2">
              {column}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}

export default SearchSidebar

