import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader,DialogTitle,DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useCreateConnectionApi, useGetConnectionsApi } from "@/api/connections";
import { ConnectionForm, formSchema, FormValues } from "./connection-form";

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


enum ConnectionType {
    POSTGRESQL = "pg",
    MYSQL = "mysql",
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

