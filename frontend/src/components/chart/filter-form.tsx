import { DatasetField} from "@backend/datasets/entities/dataset-field.entity";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {z} from "zod";
import { format} from "date-fns";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader,DialogTitle,DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Checkbox} from "../ui/checkbox";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { ArgsFilter } from "@/api/charts";
import { useState } from "react";


enum ValueType {
    STRING = "string",
    INTEGER = "integer",
    FLOAT = "float",
    DATE = "date",
    DATETIME = "datetime",
    BOOLEAN = "boolean"
}

const operations : { name: string, args: number, types?: string[] }[] = [
    { name: "=", args: 1 },
    { name: "!=", args: 1 },
    { name: ">=", args: 1 },
    { name: "<", args: 1 },
    { name: "<=", args: 1 },
    { name: "between", args: 2 },
    { name: "like", args: 1, types: [ValueType.STRING] },
]  as const;



export function FilterFormDialog({datasetField, value, hook, updateState}: {datasetField: DatasetField, updateState: (newArgs: ArgsFilter) => void, value: ArgsFilter | undefined, hook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]}) {
    return (
   <Dialog open={hook[0]} onOpenChange={hook[1]}>
        <DialogContent className="max-w-4xl max-h-screen">
            <DialogHeader>
                <DialogTitle>Add Dataset</DialogTitle>
                <DialogDescription>
                    Add a new dataset using this form.
                </DialogDescription>
            </DialogHeader>
            <FilterForm datasetField={datasetField} value={value} setOpen={hook[1]} updateState={updateState}/>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button form="edit-filter-form" type="submit">Submit</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
   )
}

export function FilterForm({datasetField, value, setOpen,updateState}: {datasetField: DatasetField, updateState: (newArgs: ArgsFilter) => void, value: ArgsFilter | undefined, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [curOperation, setCurOperation] = useState(value?.operator ?? operations[0].name);
    const selectedOperation = operations.find((o) => o.name === curOperation);
    const formSchema = z.object({
        field: z.string(),
        operator: z.enum(operations.map((op) => op.name) as [string, ...string[]]),
        value1: selectZodType(datasetField.type).optional(),
        value2: selectZodType(datasetField.type).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            field: datasetField.name ?? "",
            operator: value?.operator ?? operations[0].name,
            value1: value?.value1 ?? "",
            value2:  value?.value2 ?? "",
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        updateState({
            operator: values.operator,
            value1: values.value1?.toString()!,
            value2: values.value2?.toString()!
        });
        setOpen(false);
    }

    return (
        <Form {...form}>
            <form id="edit-filter-form" onSubmit={form.handleSubmit(onSubmit,(err) => console.log(err))}>
                <FormField 
                    control={form.control}
                    name="field"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Field</FormLabel>
                            {/* <Input {...field} /> */}
                            <Select disabled onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a field" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={datasetField.name}>
                                        {datasetField.name}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>
                <FormField 
                    control={form.control}
                    name="operator"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Operation</FormLabel>
                            <Select onValueChange={(value) => {setCurOperation(value); field.onChange(value);}} value={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a operation" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {operations.filter((o) => !o.types || o.types.includes(datasetField.type)).map((f) => (
                                    <SelectItem key={f.name} value={f.name}>
                                        {f.name}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}>
                </FormField>
                {selectedOperation && selectedOperation.args>=1 && (
                    <FormField
                        control={form.control}
                        name="value1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Arg 1</FormLabel>
                                <FormFieldSelection type={datasetField.type} field={field}/>
                                <FormDescription>
                                    First argument for this operation
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    ></FormField>
                )}
                {selectedOperation && selectedOperation.args>=2 && (
                    <FormField
                        control={form.control}
                        name="value2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Arg 2</FormLabel>
                                <FormFieldSelection type={datasetField.type} field={field}/>
                                <FormDescription>
                                    Second argument for this operation
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    ></FormField>
                )}
            </form>
        </Form>
    )
}


function selectZodType(type: ValueType) {
    switch (type) {
        case ValueType.STRING:
            return z.string();
        case ValueType.INTEGER:
            return z.number().int();
        case ValueType.FLOAT:
            return z.number();
        case ValueType.BOOLEAN:
            return z.boolean();
        case ValueType.DATE || ValueType.DATETIME:
            return z.string();
    }
    return z.string();
}

interface FieldSelectionProps {
    type: ValueType,
    field: any
}


function FormFieldSelection({type, field}: FieldSelectionProps) {
    switch (type) {
        case ValueType.BOOLEAN:
            return (
                <FormControl>
                    <Checkbox onCheckedChange={field.onChange} checked={field.value} />
                </FormControl>
            )
        case ValueType.FLOAT:
            return (
                <FormControl>
                    <Input type="number" {...field}/>
                </FormControl>
            )
        case ValueType.INTEGER:
            return (
                <FormControl>
                    <Input type="number" step={1} {...field}/>
                </FormControl>
            )
        case ValueType.STRING: 
            return (
                <FormControl>
                    <Input {...field}/>
                </FormControl>
            )
        case ValueType.DATE:
        case ValueType.DATETIME:
            return (
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(val) => {console.log(val?.toISOString()); field.onChange(val?.toISOString())}}
                    // initialFocus
                />
                </PopoverContent>
            </Popover>
            )
    }
}