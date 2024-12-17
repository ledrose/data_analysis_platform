'use client'
import { ChartsList } from "@/components/front-page/charts-list";
import { ConnectionsList } from "@/components/front-page/connections-list";
import { DatasetsList } from "@/components/front-page/datasets-list";

export default function MainPage() {
    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Data Analysis Dashboard</h1>
          <div className="space-y-12">
            <ConnectionsList />
            <DatasetsList />
            <ChartsList />
          </div>
        </div>
    )
}