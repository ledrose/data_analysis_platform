import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import {z} from "zod"
import { Select, SelectValue,SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { ApiError } from "@/_helpers/CustomFetchHook";

export type FormValues = z.infer<typeof formSchema>


export enum ConnectionType {
    POSTGRESQL = "pg",
    MYSQL = "mysql",
}

export const formSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    type: z.nativeEnum(ConnectionType),
    host: z.string().min(1),
    port: z.coerce.number().min(1),
    database: z.string().min(1),
    schema: z.string().optional(),
    username: z.string().min(1),
    password: z.string().min(1),
})

export function ConnectionForm({form,onSubmit,err,type}: {form: UseFormReturn<FormValues>, onSubmit: (values: FormValues) => void,err: ApiError | null,type: "add" | "update"}) {
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

            <div className="col-span-full md:col-span-1">
            <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Database Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a database type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {Object.values(ConnectionType).map((type: ConnectionType) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <div className="space-y-4">
            <div className="flex space-x-4">
                <div className="flex-1">
                <FormField
                    control={form.control}
                    name="host"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Host</FormLabel>
                        <FormControl>
                        <Input placeholder="localhost" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <div className="w-1/3">
                <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Port</FormLabel>
                        <FormControl>
                        <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
            </div>
            <div>
                <FormField
                control={form.control}
                name="database"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Database Name</FormLabel>
                    <FormControl>
                        <Input placeholder="my_database" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div>
                <FormField
                control={form.control}
                name="schema"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Schema (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="public" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            </div>

            <div className="col-span-full md:col-span-1">
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                    <Input placeholder="db_user" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>

            <div className="col-span-full md:col-span-1">
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            {err?.message &&
                <div className="col-span-full">
                    {err.message}
                </div>
            }
        </form>
        </Form>
    )
}