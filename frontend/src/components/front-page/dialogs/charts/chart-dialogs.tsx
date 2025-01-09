import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader,DialogTitle,DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ChartForm, DatasetNameWithId, formSchema, FormValues } from "./chart-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chart } from "@backend/charts/entities/chart.entity";
import { useAddChartApi, useUpdateChartApi } from "@/api/charts";
import { useMainPageStore } from "@/_store/store";


interface AddChartDialogProps {
    defaultDataset?: DatasetNameWithId,
    // onAddChart?: (data: Chart) => void,
    children?: React.ReactNode,
    useOpenHook?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export function AddChartDialog({defaultDataset,children, useOpenHook}: AddChartDialogProps) {
    const {sendRequest:addChart} = useAddChartApi();
    const getCharts = useMainPageStore(state => state.updateChart);
    const [open,setOpen] = useOpenHook || useState(false);

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
                getCharts();
                // onAddChart && onAddChart(data);
            }
        })(data);
        // console.log(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children} 
                    {/* <Button variant="default">
                        <Plus className="mr-2 h-4 w-4" /> Add Chart
                    </Button> */}
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

export function UpdateChartDialog({chartInfo, children, useOpenHook = useState(false)}: {chartInfo: ChartInterface, children?: React.ReactNode, useOpenHook?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]}) {
    const {sendRequest:updateChart} = useUpdateChartApi();
    const getCharts = useMainPageStore(state => state.updateChart);
    
    const [open,setOpen] = useOpenHook;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: chartInfo
    })

    const onSubmit = (data: FormValues) => {
        updateChart({onData: () => {
            setOpen(false);
            getCharts();
        }})(chartInfo.id, data);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
                {/* <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add Chart
                </Button> */}
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