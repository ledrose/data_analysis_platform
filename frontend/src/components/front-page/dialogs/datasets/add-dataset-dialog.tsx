import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader,DialogTitle,DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useCreateConnectionApi, useGetConnectionsApi } from "@/api/connections";
import { ConnectionNameWithId, DatasetForm, formSchema, FormValues } from "./dataset-form";
import { useCreateDatasetApi, useGetDatasetsApi } from "@/api/datasets";
import { useMainPageStore } from "@/_store/store";

type ReturnGetDatasetType = ReturnType<typeof useGetDatasetsApi>['sendRequest']

export function AddDatasetDialog({useOpenHook,defaultConnection}: {getDatasets: ReturnGetDatasetType, useOpenHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>],defaultConnection?: ConnectionNameWithId}) {
    const [open,setOpen] = useOpenHook;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl max-h-screen">
                <DialogHeader>
                    <DialogTitle>Add Dataset</DialogTitle>
                    <DialogDescription>
                        Add a new dataset using this form.
                    </DialogDescription>
                </DialogHeader>
                <AddDatasetForm setOpen={setOpen}/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button form="add-dataset-form" type="submit">Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}





function AddDatasetForm({setOpen,defaultConnection}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>, defaultConnection?: ConnectionNameWithId} ) {
    const getDatasets = useMainPageStore(state => state.updateDataset);
    const {isLoading,err,sendRequest} = useCreateDatasetApi();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            connectionId: ""
        }
    })
    function onSubmit(values: FormValues) {
        console.log(values)
        sendRequest({
            onData: (_) => {
                setOpen(false);
                getDatasets();
            }
        })(values);
    }
    return <DatasetForm form={form} defaultConnection={undefined} onSubmit={onSubmit} type="add"/>
    
}

