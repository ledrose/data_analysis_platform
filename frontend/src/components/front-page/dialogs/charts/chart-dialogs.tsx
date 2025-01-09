import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader,DialogTitle,DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ChartForm, DatasetNameWithId, formSchema, FormValues } from "./chart-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chart } from "@backend/charts/entities/chart.entity";
import { useAddChartApi } from "@/api/charts";

export function AddChartDialog({defaultDataset,onAddChart}: {defaultDataset?: DatasetNameWithId,onAddChart?: (data: Chart) => void}) {
    const {sendRequest:addChart} = useAddChartApi();
    const [open,setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            datasetId: "",
        }
    })

    const onSubmit = (data: FormValues) => {
        addChart({
            onData: (data) => {
                setOpen(false);

            }
        })(data);
        // console.log(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add Chart
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-screen">
                <DialogHeader>
                    <DialogTitle>Add Chart</DialogTitle>
                    <DialogDescription>
                        Add a new chart using this form.
                    </DialogDescription>
                </DialogHeader>
                <ChartForm defaultDataset={defaultDataset} form={form} onSubmit={onSubmit} type="add"/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button form="add-chart-form" type="submit">Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface ChartInterface {
    id: string;
    name: string;
    description: string;
    datasetId: string;
}

export function UpdateChartDialog({chartInfo}: {chartInfo: ChartInterface}) {

    const [open,setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: chartInfo
    })

    const onSubmit = (data: FormValues) => {
        console.log(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add Chart
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-screen">
                <DialogHeader>
                    <DialogTitle>Add Chart</DialogTitle>
                    <DialogDescription>
                        Edit a chart using this form.
                    </DialogDescription>
                </DialogHeader>
                <ChartForm form={form} onSubmit={onSubmit} type="update"/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button form="update-chart-form" type="submit">Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}