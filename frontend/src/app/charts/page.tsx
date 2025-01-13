'use client'
import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import PlaceholderChart from '@/components/chart/chart'
import {DndContext, DragEndEvent, DragStartEvent, useDraggable, useDroppable} from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowUp, Cross, Delete, Settings } from 'lucide-react'
import { ArgsAxis, ArgsFilter, ArgsSort, Field, useDeleteChartPropsApi, useGetChartApi, useUpdateChartApi, useUpdateChartPropsApi } from '@/api/charts'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ChartPropType } from '@backend/charts/dto/update-chart-prop.dto'
import { useExecuteChartQuery } from '@/api/query'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SelectGroup } from '@radix-ui/react-select'
import { DatasetField } from '@backend/datasets/entities/dataset-field.entity'
import { FilterFormDialog } from '@/components/chart/filter-form'


export enum AxisType {
  X = "x",
  Y = "y"
}


export enum ChartType {
  BAR = "bar",
  LINE = "line",
  PIE = "pie"
}



export default function ChartPage() {
    const router = useRouter();
    const {data:chart,sendRequest: getChart} = useGetChartApi();
    const {sendRequest: updateChartProps} = useUpdateChartPropsApi()
    const {sendRequest: deleteChartProps} = useDeleteChartPropsApi()
    const {sendRequest: updateChart} = useUpdateChartApi();
    const {data:chartData, sendRequest: executeChart} = useExecuteChartQuery();
    const searchParams = useSearchParams();
    const [chartType,setChartType] = useState<"line" | "bar" | "pie">("line");
    const chartId = searchParams.get('id') as string;
    useEffect(() => {
      getChart({
        onErr: () => router.push('/')
      })(chartId);
    },[]);
    useEffect(() => {
      if (!chart) return;
      setChartState({
        xAxis: chart.axes.filter((axis) => axis.type === AxisType.X).map((axis) => {return {id: axis.fieldId, name: axis.field.name, type: axis.field.type, aggregateType: axis.field.aggregateType, args: axis}}),
        yAxis: chart.axes.filter((axis) => axis.type === AxisType.Y).map((axis) => {return {id: axis.fieldId, name: axis.field.name, type: axis.field.type, aggregateType: axis.field.aggregateType, args: axis}}),
        filter: chart.filters.map((axis) => {return {id: axis.fieldId, name: axis.field.name, type: axis.field.type, aggregateType: axis.field.aggregateType, args: axis}}),
        sort: chart.sorts.map((axis) => {return {id: axis.fieldId, name: axis.field.name, type: axis.field.type, aggregateType: axis.field.aggregateType, args: axis}}),
      });      
      setChartType(chart.type);
    },[chart])
    const fields = chart?.dataset.fields as DatasetField[] || [];
    const aggregateFields = useMemo(() => fields.filter((field) => field.aggregateType != 'none'),[fields]);
    const basicFields = useMemo(() => fields.filter((field) => field.aggregateType === 'none'),[fields]);
    const [chartState,setChartState] = useState({
      xAxis: [] as Field<ArgsAxis>[],
      yAxis: [] as Field<ArgsAxis>[],
      filter: [] as Field<ArgsFilter>[],
      sort: [] as Field<ArgsSort>[]
    } as Record<string, Field<any>[]>);
    useEffect(() => {
      if (chartState.xAxis.length === 0 || chartState.yAxis.length === 0) return
      executeChart({
        // onData: console.log,
      })(chartId);
    },[chartState])
    const [isBasicDragged, setIsBasicDragged] = useState(false)
    const [isAggregatedDragged, setIsAggregatedDragged] = useState(false)

    const updateChartType = (type: ChartType) => {
      updateChart({
        onData: () => {
          setChartType(type);
        },
      })(chartId,{type});
    }
    const onDeleteFromAttrZone = (zoneId: string,id: number) => {
      deleteChartProps({
        onData: () => {
          setChartState((prevState) => {
            const nextState = structuredClone(prevState);
            nextState[zoneId] = nextState[zoneId].filter((field) => field.id !== id);
            return nextState
          })
        },
      })(chartId,zoneId as ChartPropType,id);
    }
    const updatePartialChartState = (zoneId: string,id: number, newArgs: ArgsAxis | ArgsFilter | ArgsSort) => {
      updateChartProps({
        onData: () => {
          setChartState((prevState) => {
            const nextState = structuredClone(prevState);
            nextState[zoneId] = nextState[zoneId].map((field) => field.id === id ? {...field, args: newArgs} : field)
            return nextState
          })
        }
      })(chartId,zoneId as ChartPropType,{id, args: newArgs});
      
    }
    const handleDragEnd = (event:DragEndEvent) => {
      console.log(event)
      setIsBasicDragged(false)
      setIsAggregatedDragged(false)
      if (event.over && event.over.id) {
        if (event.over.data.current?.fieldType === "any" || event.active.data.current?.fieldType === event.over.data.current?.fieldType) {
          updateChartProps({
            onData: (data) => {
              setChartState((prevState) => {
                const nextState = structuredClone(prevState);
                const newField = fields.find((field) => field.id === data.fieldId) as Field<any>;
                newField.args = data;
                if (event.active.data.current) nextState[event.over!.id].push(newField);
                console.log(nextState[event.over!.id])
                return nextState
               })
            }
          })(chartId, event.over.id.toString() as ChartPropType,{id: event.active.id as number})
          
        }
      }
    }

    const handleDragStart = (event:DragStartEvent) => {
      if (basicFields.map((field) => field.id.toString()).includes(event.active.id.toString())) {
        setIsBasicDragged(true)
      } else if (aggregateFields.map((field) => field.id.toString()).includes(event.active.id.toString())) {
        setIsAggregatedDragged(true)
      } else {
        setIsAggregatedDragged(true)
        setIsBasicDragged(true)
      }
    }
    return (
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="container mx-auto p-4">
        {/* <h1 className="text-2xl font-bold mb-4">Chart Builder</h1> */}
        <div className="flex h-[calc(100vh-100px)]">
          <Card className="w-1/3 p-4 mr-4 overflow-auto">
            <div className="flex">
              <div className='w-1/2 pr-2'>
                <StoreZone name="Fields" fields={basicFields}/>
                <StoreZone name="Aggregate" fields={aggregateFields}/>
              </div>
              <div className="w-1/2">
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                  {/* <Label htmlFor='chartType'>Chart Type</Label> */}
                  <Select onValueChange={updateChartType} value={chartType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(ChartType).map((type) => (
                          <SelectItem key={type} value={type}>
                              {type}
                          </SelectItem>
                          
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <AxisZone onDelete={onDeleteFromAttrZone} isItemDragged={isBasicDragged} id="xAxis" name="xAxis" fieldType='normal' fields={chartState['xAxis']}/>
                <AxisZone onDelete={onDeleteFromAttrZone} isItemDragged={isAggregatedDragged} id="yAxis" name="yAxis" fieldType='aggregate' fields={chartState['yAxis']}/>
                <SortZone onDelete={onDeleteFromAttrZone} isItemDragged={isBasicDragged || isAggregatedDragged} id="sort" name="Sort" fieldType='any' fields={chartState['sort']} updateState={updatePartialChartState}/>
                <FilterZone onDelete={onDeleteFromAttrZone} isItemDragged={isBasicDragged} id="filter" name="Filter" fieldType='normal' fields={chartState['filter']} updateState={updatePartialChartState} datasetFields={fields}/>
              </div>
            </div>
          </Card>
          <Card className="w-2/3 p-4">
            <PlaceholderChart chartData={chartData} chartState={chartState} chartType={chartType} />
          </Card>
        </div>
      </div>
      </DndContext>
    )
}



function StoreZone({name, fields}: {name: string, fields: Field<any>[]}) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{name}</h3>
      <div className="font-semibold mb-2">
        {fields.map((field) => (
          <DraggableDatasetCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  )
}


interface ChartZoneProps<T> {
  id: string
  name: string
  fields: Field<T>[]
  fieldType: "normal" | "aggregate" | "any",
  isItemDragged?: boolean
  onDelete: (zoneId: string,id: number) => void
}

interface SortChartZoneProps<T> extends ChartZoneProps<T> {
  updateState: (zoneId: string,id: number, newArgs:T) => void
}

function AxisZone({id, fields,name, fieldType, onDelete, isItemDragged = false}: ChartZoneProps<ArgsAxis>) {
  const {isOver, setNodeRef} = useDroppable({id,
    data: {
      fieldType: fieldType
    }
  });
  const color = {color: isOver ? 'bg-primary' : 'bg-muted'}
  const draggedStyle = isItemDragged ?  {border: '1px dashed #ccc', backgroundColor: 'green'} : {border: '1px solid #ccc'}
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{name}</h3>
      <div ref={setNodeRef} className={`bg-muted min-h-[100px] p-2 rounded`} style={draggedStyle}>
        {fields.map((field) => (
          <DatasetCard onDelete={(fieldId: number) => onDelete(id,fieldId)} key={field.id} field={field} />
        ))}
      </div>
    </div>
  )
}


function SortZone({id, fields,name, fieldType, onDelete, isItemDragged = false, updateState}: SortChartZoneProps<ArgsSort>) {
  const {isOver, setNodeRef} = useDroppable({id,
    data: {
      fieldType: fieldType
    }
  });

  const reverseOrder = (field: Field<ArgsSort>) => {
    console.log(field)
    const args = field.args!;
    args.asc = !args.asc;
    updateState(id, field.id, args);
  }

  const color = {color: isOver ? 'bg-primary' : 'bg-muted'}
  const draggedStyle = isItemDragged ?  {border: '1px dashed #ccc', backgroundColor: 'green'} : {border: '1px solid #ccc'}
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{name}</h3>
      <div ref={setNodeRef} className={`bg-muted min-h-[100px] p-2 rounded`} style={draggedStyle}>
        {fields.map((field) => (
          <DatasetCard onDelete={(fieldId: number) => onDelete(id,fieldId)} key={field.id} field={field}>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(_) => reverseOrder(field)}>
              {field.args?.asc ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </Button>
          </DatasetCard>
        ))}
      </div>
    </div>
  )
}


interface FilterChartZoneProps<T> extends ChartZoneProps<T> {
  updateState: (zoneId: string,id: number, newArgs: T) => void
  datasetFields: DatasetField[]
}

function FilterZone({id, fields,name, fieldType, onDelete, isItemDragged = false, datasetFields, updateState}: FilterChartZoneProps<ArgsFilter>) {
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
  const [formInitData, setFromInitData] = useState<{args: ArgsFilter, datasetField: DatasetField, fieldId: number} | undefined>(undefined);
  const {isOver, setNodeRef} = useDroppable({id,
    data: {
      fieldType: fieldType
    }
  });

  const color = {color: isOver ? 'bg-primary' : 'bg-muted'}
  const draggedStyle = isItemDragged ?  {border: '1px dashed #ccc', backgroundColor: 'green'} : {border: '1px solid #ccc'}
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{name}</h3>
      <FilterFormDialog 
              updateState={(newArgs) => updateState(id, formInitData?.fieldId!, newArgs)} 
              hook={[isFilterFormOpen, setIsFilterFormOpen]} 
              datasetField={formInitData?.datasetField!} 
              value={formInitData?.args}/>
      <div ref={setNodeRef} className={`bg-muted min-h-[100px] p-2 rounded`} style={draggedStyle}>
        {fields.map((field) => {
          return(
          <DatasetCard onDelete={(fieldId: number) => onDelete(id,fieldId)} key={field.id} field={field}>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(ev) => {
              setFromInitData({
                args: field.args!,
                datasetField: datasetFields.find((datasetField) => datasetField.id == field.id)!,
                fieldId: field.id
              }); 
              setIsFilterFormOpen(true)}}>
              <Settings className="h-4 w-4" />
            </Button>
          </DatasetCard>
        )})}
      </div>
    </div>
  )
}



function DraggableDatasetCard({field}: {field:Field<any>}) {
  const {attributes,listeners,setNodeRef,transform} = useDraggable({
    id: field.id.toString(),
    data: {
      fieldType: field.aggregateType=='none' ? 'normal' : 'aggregate',
      field
    }
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  const color = attributes['aria-pressed'] ? 'bg-orange-200' : 'bg-secondary'

  return (
    <button ref={setNodeRef} {...attributes} {...listeners} style={style} className={' text-secondary-foreground p-2 mb-2 w-full rounded flex items-center justify-between shadow-sm '+color}>
      <span className="font-medium">{field.name}</span>
    </button>
  )
}

interface DatasetCardProps {
  field: Field<any>
  onDelete?: (id: number) => void,
  children?: React.ReactNode
}

function DatasetCard({field, onDelete, children}: DatasetCardProps) {
  return (
    <div className={'text-secondary-foreground p-2 mb-2 w-full rounded flex items-center justify-between shadow-sm bg-secondary'}>
      <span className="font-medium">{field.name}</span>
      {children}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {onDelete && onDelete(field.id)}}
        className="h-6 w-6"
      >
        <Delete className="h-4 w-4" />
      </Button>
    </div>
  )
}
