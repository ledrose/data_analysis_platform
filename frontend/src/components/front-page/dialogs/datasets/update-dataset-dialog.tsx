import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader,DialogTitle,DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useCreateConnectionApi, useGetConnectionsApi } from "@/api/connections";
import { ConnectionNameWithId, DatasetForm, formSchema, FormValues } from "./dataset-form";
import { useCreateDatasetApi, useGetDatasetsApi, useUpdateDatasetApi } from "@/api/datasets";
import { useMainPageStore } from "@/_store/store";
import { Dataset } from "@backend/datasets/entities/dataset.entity";


export function UpdateDatasetDialog({useOpenHook,dataset}: {useOpenHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>],dataset: Dataset, defaultConnection?: ConnectionNameWithId}) {
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
                <UpdateDatasetForm value={dataset} setOpen={setOpen}/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button form="update-dataset-form" type="submit">Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}





function UpdateDatasetForm({setOpen,value, defaultConnection}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>, value: Dataset, defaultConnection?: ConnectionNameWithId} ) {
    const getDatasets = useMainPageStore(state => state.updateDataset);
    const {isLoading,err,sendRequest} = useUpdateDatasetApi();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: value
    })
    function onSubmit(values: FormValues) {
        console.log(values)
        sendRequest({
            onData: (_) => {
                setOpen(false);
                getDatasets();
            }
        })(value.id,values);
    }
    return <DatasetForm form={form} defaultConnection={undefined} onSubmit={onSubmit} type="update"/>
    
}

