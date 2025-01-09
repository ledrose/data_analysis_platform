import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription,FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from 'lucide-react'
import { TableMetadataDto } from '@backend/connections/dto/table-info.dto'
import {z} from "zod"
import { Textarea } from '@/components/ui/textarea';
import { useForm, UseFormReturn } from 'react-hook-form';
import { ApiError } from '@/_helpers/CustomFetchHook';
import { zodResolver } from '@hookform/resolvers/zod';
import { SourceTable } from '@backend/source/entities/source-table.entity';
import { useAddBaseTableApi, useAddJoinedTableApi } from '@/api/datasets';


enum JoinType {
    INNER = "inner",
    LEFT = "left",
    RIGHT = "right",
}


export type FormValues = z.infer<typeof formSchema>

const formSchema = z.object({
    leftField: z.string().nonempty(),
    relationType: z.nativeEnum(JoinType),
    rightTable: z.string().nonempty(),
    rightField: z.string().nonempty()
})

interface AddRelationDialogProps {
    table: string,
    datasetId: string,
    usedTables: SourceTable[],
    resetData: () => void,
    tablesMetadata: TableMetadataDto
}

export const AddRelationDialog = ({ table, datasetId, resetData, usedTables, tablesMetadata }: AddRelationDialogProps) => {
    const rightTableColumns = tablesMetadata.columns.find((column) => column.table === table)?.columns.map((column) => column.column)
    const {sendRequest:addBaseTable} = useAddBaseTableApi();
    const {sendRequest:addJoinedTable} = useAddJoinedTableApi();
    const [open,setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema.refine(
            (data) => tablesMetadata.columns.find((column) => column.table === data.rightTable)?.columns.find((column) => column.column === data.rightField), 
            {message: "Field does not exist in selected table", path: ["rightField"]}
        )),
        defaultValues: {
          leftField: '',
          relationType: JoinType.INNER,
          rightTable: '',
          rightField: ''
        },
      })

    const handleOpen = (open: boolean) => {
        if (usedTables.length === 0) {
            addBaseTable({
                onData: resetData
            })(datasetId,{name: table, auto_populate: true});
            setOpen(false)
        } else {
            setOpen(open)
        }
    }

    const handleSubmit = (values: FormValues) => {
        addJoinedTable({
            onData: resetData
        })(datasetId,{
            name: table,
            join: {
                type: values.relationType,
                leftSourceField: values.leftField,
                rightSourceTable: values.rightTable,
                rightSourceField: values.rightField
            }
        })
    }
    return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Relation for {table}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
        <form id="add-relation-form" onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="leftField"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Field of Left table</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a join field for left table" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {rightTableColumns && rightTableColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                            {column}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="relationType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Join Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a join type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {Object.values(JoinType).map((type) => (
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
            <FormField
                control={form.control}
                name="rightTable"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Right table</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a table to join to" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {usedTables.map((table) => (
                        <SelectItem key={table.id} value={table.name}>
                            {table.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="rightField"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Field of right table</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.getValues("rightTable")}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a database type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {form.getValues("rightTable") && tablesMetadata.columns.find((column) => column.table === form.getValues("rightTable"))?.columns.map((column,ind) => (
                        <SelectItem key={ind} value={column.column}>
                            {column.column}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </form>
        </Form>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button form="add-relation-form" type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}
