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
import { AddChartDialog } from "@/components/front-page/dialogs/charts/chart-dialogs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    if (data && data.fields.length != 0 && data.sourceTables.length != 0) {
      executeQuery()(data.id);
    }
  },[data?.fields]);

  useEffect(() => {
    if (data) {
      getMetadata({
        onData: (data) => {
          datasetStore.setMetadata(data);
        }
      })(data.connectionId);
    }
  },[data?.connectionId]);

  return (
    <>
        <ResizablePanelGroup direction="vertical" className="rounded-lg border">
          <ResizablePanel className="!overflow-y-auto">
          <Tabs defaultValue="fields">
            <div className="flex justify-between w-100">
              <TabsList className="grid grid-cols-2 items-center mb-4 w-[200px]">
                <TabsTrigger value="fields">Fields</TabsTrigger>
                <TabsTrigger value="relations">Relations</TabsTrigger>
              </TabsList>
              <div className="w-auto">
                <AddChartDialog defaultDataset={data??undefined} onAddChart={(data) => router.push(`/charts?id=${data.id}`)}>
                    <Button variant="default">
                        <Plus className="mr-2 h-4 w-4" /> Add Chart
                    </Button>
                </AddChartDialog>
              </div>
            </div>
            <TabsContent value="fields">
              <div className="flex-1 overflow-hidden">
                <h2 className="text-xl font-semibold mb-2">Dataset Fields</h2>
                <DatasetFieldsTable datasetId={datasetId} usedTables={data?.sourceTables ?? []}/>
              </div>
            </TabsContent>
            <TabsContent value="relations">
              <div className="flex mb-6 overflow-hidden">
                <SearchSidebar metadata={metadata} datasetId={datasetId} usedTables={data?.sourceTables ?? []} resetData={resetData}/>
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