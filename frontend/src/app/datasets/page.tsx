'use client'
import useCustomFetch from "@/_helpers/CustomFetchHook";
import DatasetFieldsTable from "@/components/datasets/dataset-fields-table";
import RelationsTable from "@/components/datasets/relation-table";
import ResultsTable from "@/components/datasets/result-table";
import SearchSidebar from "@/components/datasets/search-sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetDatasetApi } from "@/api/datasets";
import { send } from "process";
// import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

// type EditorMode = 'relations' | 'fields'

export default function DatasetPage() {
  const datasetId = "b9bd94f7-3288-433c-b719-ec0898c9ad3f";
  const {data,sendRequest} = useGetDatasetApi();
  useEffect(() => {
    sendRequest()(datasetId);
  },[])
  return (
    <>
        <ResizablePanelGroup direction="vertical" className="rounded-lg border">
          <ResizablePanel className="!overflow-y-auto">
          <Tabs defaultValue="fields">
            <TabsList className="grid grid-cols-2 items-center mb-4 w-[200px]">
              <TabsTrigger value="fields">Fields</TabsTrigger>
              <TabsTrigger value="relations">Relations</TabsTrigger>
            </TabsList>
            <TabsContent value="fields">
              <div className="flex-1 overflow-hidden">
                <h2 className="text-xl font-semibold mb-2">Dataset Fields</h2>
                <DatasetFieldsTable />
              </div>
            </TabsContent>
            <TabsContent value="relations">
              <div className="flex mb-6 overflow-hidden">
                <SearchSidebar />
                <div className="flex-1 ml-6">
                  <h2 className="text-xl font-semibold mb-2">Table Relations</h2>
                  <RelationsTable />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} className="!overflow-y-auto">
            <div className="flex-1 overflow-hidden">
              <h2 className="text-xl font-semibold mb-2">Query Results</h2>
              <ResultsTable />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
    </>
  );
}