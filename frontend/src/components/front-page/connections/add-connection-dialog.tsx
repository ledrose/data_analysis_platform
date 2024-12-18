import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader,DialogTitle,DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { ConnectionType } from "@backend/connections/entities/connection.entity";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod"
import { Plus } from "lucide-react";
import { Select, SelectValue,SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useCreateConnectionApi, useGetConnectionsApi, useUpdateConnectionApi } from "@/api/connections";
import { ApiError } from "@/_helpers/CustomFetchHook";
import { UpdateConnectionDto } from "@backend/connections/dto/update-connection.dto";
import { ConnectionDto } from "@backend/connections/dto/connection.dto";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

type ReturnGetConnectionType = ReturnType<typeof useGetConnectionsApi>['sendRequest']

export function AddConnectionDialog({getConnections}: {getConnections: ReturnGetConnectionType}) {
    const [open,setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add Connection
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-screen">
                <DialogHeader>
                    <DialogTitle>Add Connection</DialogTitle>
                    <DialogDescription>
                        Add a new connection using this form.
                    </DialogDescription>
                </DialogHeader>
                <AddConntionForm setOpen={setOpen} getConnections={getConnections}/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button form="add-connection-form" type="submit">Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function UpdateConnectionDialog({children,getConnections,connectionId, connectionInfo}: {children: React.ReactNode, getConnections: ReturnGetConnectionType, connectionId: string, connectionInfo: ConnectionDto}) {
    const [open,setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children}
            <DialogContent className="max-w-4xl max-h-screen">
                <DialogHeader>
                    <DialogTitle>Update Connection</DialogTitle>
                    <DialogDescription>
                        Update connection using this form.
                    </DialogDescription>
                </DialogHeader>
                <UpdateConnectionForm setOpen={setOpen} getConnections={getConnections} connectionId={connectionId} connectionInfo={connectionInfo}/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button form="update-connection-form" type="submit">Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


enum ConnectionType {
    POSTGRESQL = "pg",
    MYSQL = "mysql",
}

type FormValues = z.infer<typeof formSchema>


function UpdateConnectionForm({setOpen,getConnections, connectionId, connectionInfo}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>, getConnections: ReturnGetConnectionType, connectionId: string, connectionInfo: ConnectionDto} ) {
    const {err,sendRequest} = useUpdateConnectionApi();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: connectionInfo
    })

    function onSubmit(values: FormValues) {
        console.log(values)
        sendRequest({
            onData: (_) => {
                setOpen(false);
                getConnections()();
            }
        })(connectionId,values);
    }

    return <ConnectionForm form={form} onSubmit={onSubmit} err={err} type="update"/>;
}

function AddConntionForm({setOpen,getConnections}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>, getConnections: ReturnGetConnectionType} ) {
    const {isLoading,err,sendRequest} = useCreateConnectionApi();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            type: ConnectionType.POSTGRESQL,
            host: "localhost",
            port: 5432,
            database: "",
            schema: "public",
            username: "",
            password: "",
        }
    })
    function onSubmit(values: FormValues) {
        console.log(values)
        sendRequest({
            onData: (_) => {
                setOpen(false);
                getConnections()();
            }
        })(values);
    }
    return <ConnectionForm form={form} onSubmit={onSubmit} err={err} type="add"/>
    
}


const formSchema = z.object({
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

function ConnectionForm({form,onSubmit,err,type}: {form: UseFormReturn<FormValues>, onSubmit: (values: FormValues) => void,err: ApiError | null,type: "add" | "update"}) {
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
                        {Object.values(ConnectionType).map((type) => (
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