'use client'
import DatasetFieldsTable from "@/components/datasets/dataset-fields-table";
import RelationsTable from "@/components/datasets/relation-table";
import ResultsTable from "@/components/datasets/result-table";
import SearchSidebar from "@/components/datasets/search-sidebar";
import {SourceTable} from "@backend/source/entities/source-table.entity"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { use, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddBaseTableApi, useAddJoinedTableApi, useGetDatasetApi, useGetDatasetFieldsApi } from "@/api/datasets";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetConnectionMetadataApi } from "@/api/connections";
import { useExecuteDatasetQuery } from "@/api/query";
import { useDatasetStore } from "@/_store/store";
// import { TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

// type EditorMode = 'relations' | 'fields'

export default function DatasetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const datasetId = searchParams.get('id') as string;
  const datasetStore = useDatasetStore();
  useEffect(() => {
    datasetStore.setDatasetId(datasetId);
  },[datasetId])
  const {data,sendRequest} = useGetDatasetApi();
  const {data:metadata,sendRequest:getMetadata} = useGetConnectionMetadataApi();
  const {data:queryResults,sendRequest:executeQuery} = useExecuteDatasetQuery();
  const resetData = () => sendRequest()(datasetId);
  useEffect(() => {
    datasetStore.setUpdateDataset(resetData);
    sendRequest({
      onErr: (err) => {
        router.push('/');
      }
    })(datasetId);
  },[]);
  useEffect(() => {
    if (data && data.fields.length != 0) {
      executeQuery()(data.id);
    }
  },[data?.fields]);

  useEffect(() => {
    if (data) {
      getMetadata()(data.connectionId);
    }
  },[data?.connectionId]);

  const handleAddRelation = (newRelation: any) => {
    
  }
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
                <DatasetFieldsTable datasetId={datasetId}/>
              </div>
            </TabsContent>
            <TabsContent value="relations">
              <div className="flex mb-6 overflow-hidden">
                <SearchSidebar metadata={metadata} datasetId={datasetId} usedTables={data?.sourceTables ?? []} resetData={resetData} handleAddRelation={handleAddRelation}/>
                <div className="flex-1 ml-6">
                  <h2 className="text-xl font-semibold mb-2">Table Relations</h2>
                  <RelationsTable tables={data?.sourceTables} relations={data?.joins} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} className="!overflow-y-auto">
            <div className="flex-1 overflow-hidden">
              <h2 className="text-xl font-semibold mb-2">Query Results</h2>
              <ResultsTable queryResults={queryResults} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
    </>
  );
}