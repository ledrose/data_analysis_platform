'use client'
import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import PlaceholderChart from '@/components/chart/placeholder'
import FieldList from '@/components/chart/field-list'
import {DndContext, DragEndEvent, DragStartEvent, useDraggable, useDroppable} from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import { Cross, Delete, Settings } from 'lucide-react'
import { set } from 'react-hook-form'
import { useGetDatasetFieldsApi } from '@/api/datasets'
import { useDeleteChartPropsApi, useGetChartApi, useUpdateChartPropsApi } from '@/api/charts'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ChartPropType } from '@backend/charts/dto/update-chart-prop.dto'


export enum AxisType {
  X = "x",
  Y = "y"
}


interface Field {
  id: number
  name: string
  type: string
  aggregateType: string
}


export default function ChartPage() {
    const router = useRouter();
    const {data:chart,sendRequest: getChart} = useGetChartApi();
    const {sendRequest: updateChartProps} = useUpdateChartPropsApi()
    const {sendRequest: deleteChartProps} = useDeleteChartPropsApi()
    const searchParams = useSearchParams();
    const chartId = searchParams.get('id') as string;
    useEffect(() => {
      getChart({
        onData: (data) => {
          setChartState({
            xAxis: data.axes.filter((axis) => axis.type === AxisType.X).map((axis) => {return {id: axis.fieldId, name: axis.field.name, type: axis.field.type, aggregateType: axis.field.aggregateType}}),
            yAxis: data.axes.filter((axis) => axis.type === AxisType.Y).map((axis) => {return {id: axis.fieldId, name: axis.field.name, type: axis.field.type, aggregateType: axis.field.aggregateType}}),
            filter: data.filters.map((axis) => {return {id: axis.fieldId, name: axis.field.name, type: axis.field.type, aggregateType: axis.field.aggregateType}}),
            sort: data.sorts.map((axis) => {return {id: axis.fieldId, name: axis.field.name, type: axis.field.type, aggregateType: axis.field.aggregateType}}),
          })
        },
        onErr: () => router.push('/')
      })(chartId);
    },[]);
    const fields = chart?.dataset.fields as Field[] || [];
    const aggregateFields = useMemo(() => fields.filter((field) => field.aggregateType != 'none'),[fields]);
    const basicFields = useMemo(() => fields.filter((field) => field.aggregateType === 'none'),[fields]);
    const [chartState,setChartState] = useState({
      xAxis: [] as Field[],
      yAxis: [] as Field[],
      filter: [] as Field[],
      sort: [] as Field[]
    } as Record<string, Field[]>);
    const [isBasicDragged, setIsBasicDragged] = useState(false)
    const [isAggregatedDragged, setIsAggregatedDragged] = useState(false)


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
    const handleDragEnd = (event:DragEndEvent) => {
      console.log(event)
      setIsBasicDragged(false)
      setIsAggregatedDragged(false)
      if (event.over && event.over.id) {
        if (event.active.data.current?.fieldType === event.over.data.current?.fieldType) {
          updateChartProps({
            onData: () => {
              setChartState((prevState) => {
                const nextState = structuredClone(prevState);
                const field = fields.find((field) => field.id.toString() === event.active.id.toString());
                if (field) nextState[event.over!.id].push(field);
                return nextState
               })
            }
          })(chartId, event.over.id.toString() as ChartPropType,{id: event.active.id as number})
          
        }
      }
    }

    const handleDragStart = (event:DragStartEvent) => {
      if (fields.map((field) => field.id.toString()).includes(event.active.id.toString())) {
        setIsBasicDragged(true)
      } else {
        setIsAggregatedDragged(true)
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
                <AxisZone onDelete={onDeleteFromAttrZone} isItemDragged={isBasicDragged} id="xAxis" name="xAxis" fieldType='normal' fields={chartState['xAxis']}/>
                <AxisZone onDelete={onDeleteFromAttrZone} isItemDragged={isAggregatedDragged} id="yAxis" name="yAxis" fieldType='aggregate' fields={chartState['yAxis']}/>
                <AxisZone onDelete={onDeleteFromAttrZone} isItemDragged={isBasicDragged} id="sort" name="Sort" fieldType='normal' fields={chartState['sort']}/>
                <AxisZone onDelete={onDeleteFromAttrZone} isItemDragged={isBasicDragged} id="filter" name="Filter" fieldType='normal' fields={chartState['filter']}/>
              </div>
            </div>
          </Card>
          <Card className="w-2/3 p-4">
            <PlaceholderChart />
          </Card>
        </div>
      </div>
      </DndContext>
    )
}



  function StoreZone({name, fields}: {name: string, fields: Field[]}) {
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


function AxisZone({id, fields,name, fieldType, onDelete, isItemDragged = false}: {id: string, fields: Field[], onDelete: (zoneId: string,id: number) => void, fieldType: "normal" | "aggregate", name: string, isItemDragged: boolean}) {
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

function DraggableDatasetCard({field}: {field:Field}) {
  const {attributes,listeners,setNodeRef,transform} = useDraggable({
    id: field.id.toString(),
    data: {
      fieldType: field.aggregateType=='none' ? 'normal' : 'aggregate'
    }
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  const color = attributes['aria-pressed'] ? 'bg-orange-200' : 'bg-secondary'

  return (
    <button ref={setNodeRef} {...attributes} {...listeners} style={style} className={' text-secondary-foreground p-2 mb-2 w-full rounded flex items-center justify-between shadow-sm '+color}>
      <span className="font-medium">{field.name}</span>
      {/* <Button ref={setNodeRef} {...attributes} {...listeners} style={style}
        size="icon"
        variant="ghost"
        onClick={() => {}}
        className="h-6 w-6"
      >
        <Settings className="h-4 w-4" />
      </Button> */}
    </button>
  )
}

function DatasetCard({field, onDelete}: {field:Field, onDelete?: (id: number) => void}) {
  return (
    <div className={' text-secondary-foreground p-2 mb-2 w-full rounded flex items-center justify-between shadow-sm bg-secondary'}>
      <span className="font-medium">{field.name}</span>
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