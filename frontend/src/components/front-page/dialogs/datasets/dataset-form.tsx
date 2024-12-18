import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import {z} from "zod"
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect } from "react";
import { Select, SelectContent,SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";
import { useGetConnectionsApi } from "@/api/connections";

export type FormValues = z.infer<typeof formSchema>

export interface ConnectionNameWithId {
    id: string,
    name: string
}


export const formSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    connectionId: z.string().min(1),
})

export function DatasetForm({form,onSubmit,defaultConnection, type}: {form: UseFormReturn<FormValues>, onSubmit: (values: FormValues) => void, defaultConnection: ConnectionNameWithId | undefined, type: "add" | "update"}) {
    const {data: connections, isLoading, sendRequest: getConnections} = useGetConnectionsApi();
    if (!defaultConnection) {
        defaultConnection = connections?.[0]
    }
    useEffect(() => {
        getConnections()();
    },[])
    return (
        <Form {...form}>
        <form id={type+"-connection-form"} onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Connection Name</FormLabel>
                    <FormControl>
                    <Input placeholder="My Database Connection" {...field} />
                    </FormControl>
                    <FormDescription>
                    A unique name for this database connection.
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
                        placeholder="Optional description for this connection"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            {!isLoading && connections &&
                <div className="col-span-full">
                <FormField
                    control={form.control}
                    name="connectionId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Connection</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={defaultConnection?.id}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a database type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {connections && connections.map((connection) => (
                            <SelectItem key={connection.id} value={connection.id}>
                                {connection.name}
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