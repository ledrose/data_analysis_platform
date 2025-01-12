import { PropsWithChildren, use, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValues, SubmitHandler, useForm, UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Source } from 'postcss'
import { SourceTable } from '@backend/source/entities/source-table.entity'
import { Textarea } from '@/components/ui/textarea'
import { useDatasetStore } from '@/_store/store'
import { useAddDatasetFieldApi, useUpdateDatasetFieldApi } from '@/api/datasets'
import { AddFieldDto } from '@backend/datasets/dataset-field/dto/add-field.dto'


export enum AggregateType {
    NONE = "none",
    SUM = "sum",
    COUNTUNIQUE = "countunique",
    COUNT = "count"
}


export enum ValueType {
    STRING = "string",
    INTEGER = "integer",
    FLOAT = "float",
    DATE = "date",
    DATETIME = "datetime",
    BOOLEAN = "boolean"
}

const calculatedFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(ValueType, {
    required_error: "Field type is required",
  }),
  aggregation: z.nativeEnum(AggregateType, {
    required_error: "Aggregation type is required",
  }),
  formula: z.string().min(1, "Formula is required"),
})

const sourceFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(ValueType, {
    required_error: "Field type is required",
  }),
  aggregation: z.nativeEnum(AggregateType, {
    required_error: "Aggregation type is required",
  }),
  sourceTable: z.string().min(1, "Source table is required"),
  sourceField: z.string().min(1, "Source field is required"),
})

export const formSchema = z.discriminatedUnion("fieldType", [
  z.object({ fieldType: z.literal("calculated"), ...calculatedFieldSchema.shape }),
  z.object({ fieldType: z.literal("source"), ...sourceFieldSchema.shape }),
])


function getPayload(values: z.infer<typeof formSchema>): AddFieldDto {
  if (values.fieldType === "source") {
      return {
          name: values.name,
          type: values.type,
          isSimple: true,
          aggregateType: values.aggregation,
          sourceFields: [{
              table: values.sourceTable,
              column: values.sourceField
          }]
      }
  } else {
      const tableColumnRegex = /\$\{([^.]+)\.([^}]+)\}/g; // Regex to find ${table.column}
      const tableColumns = [];
      let match;
      let manipulatedString = values.formula;

      // 1. Extract table.column instances
      while ((match = tableColumnRegex.exec(values.formula)) !== null) {
          tableColumns.push({
          table: match[1],
          column: match[2],
          });
      }

      // 2. Replace instances with ${index}
      for (let i = 0; i < tableColumns.length; i++) {
          const table = tableColumns[i].table;
          const column = tableColumns[i].column;
          const regex = new RegExp(`\\$\\{${table}\\.${column}\\}`, 'g'); // Specific regex for each table.column
          manipulatedString = manipulatedString.replace(regex, `\$\{${i}\}`);
      }
      return {
          name: values.name,
          type: values.type,
          isSimple: false,
          aggregateType: values.aggregation,
          formula: manipulatedString,
          sourceFields: tableColumns
      }
  }
}


interface UpdateDatasetFieldDialogProps {
  tables: SourceTable[],
  fieldId: number,
  defaultValues?: z.infer<typeof formSchema>,
  onAddField: (field: z.infer<typeof formSchema>) => void,
}

export function UpdateDatasetFieldDialog({ children, tables, onAddField,defaultValues,fieldId }: PropsWithChildren<UpdateDatasetFieldDialogProps>) {
  const datasetId = useDatasetStore((state) => state.datasetId);
  const updateDataset = useDatasetStore((state) => state.updateDataset);
  const {sendRequest:updateField} = useUpdateDatasetFieldApi();

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: defaultValues
    }); 

  function onSubmit(values: z.infer<typeof formSchema>) {
      updateField({
        onData: (_) => {
            updateDataset();
            onAddField(values);
            setOpen(false)
            form.reset()
        }
    })(datasetId, fieldId, getPayload(values));
  }
  return <FieldForm children={children} form={form} onSubmit={onSubmit} tables={tables} openHook={[open, setOpen]} text={{title: "Update Dataset Field", submitText: "Update Field", openButtonText: "Update"}}/>
}


interface AddDatasetFieldDialogProps {
  tables: SourceTable[],
  onAddField: (field: z.infer<typeof formSchema>) => void,
}

export function AddDatasetFieldDialog({children, tables, onAddField}: PropsWithChildren<AddDatasetFieldDialogProps>) {
  const datasetId = useDatasetStore((state) => state.datasetId);
  const updateDataset = useDatasetStore((state) => state.updateDataset);
  const {sendRequest:addField} = useAddDatasetFieldApi();
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        fieldType: "source",
        name: "",
        type: ValueType.STRING,
        aggregation: AggregateType.NONE,
        sourceTable: "",
        sourceField: "",
      },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    addField({
          onData: (_) => {
              updateDataset();
              onAddField(values);
              setOpen(false)
              form.reset()
          }
      })(datasetId,[getPayload(values)]); 
  }
  return <FieldForm children={children} form={form} onSubmit={onSubmit} tables={tables} openHook={[open, setOpen]} text={{title:"Add Dataset Field",submitText:"Add Field",openButtonText:"Add Field"}}/>
}

interface FieldFormProps {
  tables: SourceTable[],
  openHook: [open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>],
  form: UseFormReturn<z.infer<typeof formSchema>>, 
  onSubmit: (values: z.infer<typeof formSchema>) => void,
  text: {
    title: string,
    submitText: string
    openButtonText: string
  }
}


function FieldForm({children, form, onSubmit, tables,openHook:[open, setOpen],text}: PropsWithChildren<FieldFormProps>) {
  const metadata = useDatasetStore((state) => state.metadata);
  const [activeTab, setActiveTab] = useState<"calculated" | "source">(form.getValues("fieldType") || "source")
  const { watch, setValue } = form
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value: string) => {
          setActiveTab(value as "calculated" | "source")
          setValue("fieldType", value as "calculated" | "source")
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculated">Calculated Field</TabsTrigger>
            <TabsTrigger value="source">Source Field</TabsTrigger>
          </TabsList>
          <TabsContent value="calculated">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="formula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formula</FormLabel>
                      <FormControl>
                        <Textarea  {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Type</FormLabel>
                      <Select onValueChange={(value) => {field.onChange(value)}} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ValueType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  name="aggregation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aggregation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select aggregation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(AggregateType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{text.submitText}</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="source">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="sourceTable"
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
                            {tables.map((table) => (
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
                    name="sourceField"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Field of right table</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.getValues("sourceTable")}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select field of right table" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {form.getValues("sourceTable") && metadata?.columns.find((column) => column.table === form.getValues("sourceTable"))?.columns.map((column,ind) => (
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
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ValueType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  name="aggregation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aggregation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select aggregation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(AggregateType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{text.submitText}</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
    )
}

