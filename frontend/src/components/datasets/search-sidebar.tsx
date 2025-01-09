'use client'
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TableMetadataDto } from "@backend/connections/dto/table-info.dto"
import { AddRelationDialog } from "../front-page/dialogs/add-relation-dialog"
import { SourceTable } from "@backend/source/entities/source-table.entity"

const SearchSidebar = ({metadata,usedTables,datasetId, resetData}: {metadata: TableMetadataDto | null,datasetId: string, usedTables: SourceTable[], resetData: () => void}) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)  
  const tables = metadata?.columns.map((table) => table.table);
  const columns = new Map(metadata?.columns.map((table) => [table.table, table.columns.map((column) => column.column)]));
  return (
    <div className="w-64 bg-gray-100 p-4 flex flex-col h-full overflow-hidden">
      <h2 className="text-lg font-semibold mb-2">Available Tables</h2>
      <ScrollArea className="flex-grow mb-4">
        <ul>
          {tables && tables.map(table => (
            <li
              key={table}
              className={`cursor-pointer p-2 rounded ${selectedTable === table ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedTable(table)}
            >
              <span>{table}</span>
              <AddRelationDialog table={table} datasetId={datasetId} resetData={resetData} usedTables={usedTables} tablesMetadata={metadata!}/>
            </li>
          ))}
        </ul>
      </ScrollArea>
      
      <h2 className="text-lg font-semibold mb-2">Columns</h2>
      <ScrollArea className="flex-grow">
        <ul>
          {selectedTable && columns.get(selectedTable)?.map(column => (
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

