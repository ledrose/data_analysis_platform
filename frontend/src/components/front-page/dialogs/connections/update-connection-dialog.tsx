import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader,DialogTitle,DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useGetConnectionsApi, useUpdateConnectionApi } from "@/api/connections";
import { ConnectionDto } from "@backend/connections/dto/connection.dto";
import { ConnectionForm, formSchema, FormValues } from "./connection-form";

type ReturnGetConnectionType = ReturnType<typeof useGetConnectionsApi>['sendRequest']


export function UpdateConnectionDialog({useOpenHook, getConnections,connectionId, connectionInfo}: {useOpenHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>], getConnections: ReturnGetConnectionType, connectionId: string, connectionInfo: ConnectionDto}) {

    return (
        <Dialog open={useOpenHook[0]} onOpenChange={useOpenHook[1]}>
            <DialogContent className="max-w-4xl max-h-screen">
                <DialogHeader>
                    <DialogTitle>Update Connection</DialogTitle>
                    <DialogDescription>
                        Update connection using this form.
                    </DialogDescription>
                </DialogHeader>
                <UpdateConnectionForm setOpen={useOpenHook[1]} getConnections={getConnections} connectionId={connectionId} connectionInfo={connectionInfo}/>
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