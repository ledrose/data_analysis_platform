'use client'
import useCustomFetch from "@/_helpers/CustomFetchHook";
import DatasetFieldsTable from "@/components/datasets/dataset-fields-table";
import RelationsTable from "@/components/datasets/relation-table";
import ResultsTable from "@/components/datasets/result-table";
import SearchSidebar from "@/components/datasets/search-sidebar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type EditorMode = 'relations' | 'fields'

export default function DatasetPage() {

  const [mode,setMode] = useState<EditorMode>('relations'); 
  return (
    <>
      <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Dataset Editor</h1>
          <div className="space-x-2">
            <Button 
              variant={mode === 'relations' ? 'default' : 'outline'}
              onClick={() => setMode('relations')}
            >Relations View</Button>
            <Button 
              variant={mode === 'fields' ? 'default' : 'outline'}
              onClick={() => setMode('fields')}
            >Fields View</Button>
          </div>
        </div>
        
        {mode === 'relations' ? (
          <>
            <div className="flex mb-6 overflow-hidden">
              <SearchSidebar />
              <div className="flex-1 ml-6">
                <h2 className="text-xl font-semibold mb-2">Table Relations</h2>
                <RelationsTable />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-hidden">
            <h2 className="text-xl font-semibold mb-2">Dataset Fields</h2>
            <DatasetFieldsTable />
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <h2 className="text-xl font-semibold mb-2">Query Results</h2>
          <ResultsTable />
        </div>
    </>
  );
}