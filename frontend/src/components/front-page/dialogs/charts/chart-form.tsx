import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import {z} from "zod"
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect } from "react";
import { Select, SelectContent,SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";
import { useGetConnectionMetadataApi, useGetConnectionsApi } from "@/api/connections";
import { useGetDatasetsApi } from "@/api/datasets";


export type FormValues = z.infer<typeof formSchema>

export interface DatasetNameWithId {
    id: string,
    name: string
}

export const formSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    datasetId: z.string().min(1),
})

interface DatasetFormProps {
    form: UseFormReturn<FormValues>
    onSubmit: (values: FormValues) => void
    defaultDataset?: DatasetNameWithId
    type: "add" | "update"
}

export function ChartForm({form,onSubmit,defaultDataset, type}: DatasetFormProps) {
    
    const {data: datasets, isLoading, sendRequest: getDatasets} = useGetDatasetsApi();
    if (!defaultDataset) {
        defaultDataset = datasets?.[0]
    }
    form.setValue("datasetId", defaultDataset?.id || "");
    useEffect(() => {
        getDatasets()();
    },[])
    return (
        <Form {...form}>
        <form id={type+"-chart-form"} onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Chart Name</FormLabel>
                    <FormControl>
                    <Input placeholder="My Chart" {...field} />
                    </FormControl>
                    <FormDescription>
                    A unique name for this chart .
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            <div className="col-span-full">
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Optional description for this chart"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            {!isLoading && datasets &&
                <div className="col-span-full">
                <FormField
                    control={form.control}
                    name="datasetId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dataset</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={defaultDataset?.id}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a dataset" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {datasets && datasets.map((dataset) => (
                            <SelectItem key={dataset.id} value={dataset.id}>
                                {dataset.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
            }
        </form>
        </Form>
    )
}