'use client'

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { Field } from '@/api/charts'

const data = [
  { name: 'A', ind:1, value: 10 },
  { name: 'B', ind:2, value: 20 },
  { name: 'C', ind:3, value: 15 },
  { name: 'D', ind:4, value: 25 },
]

export default function PlaceholderChart({chartData, chartState, chartType}: {chartData: any, chartState: Record<string, Field<any>[]>, chartType: string}) {
  return (chartData && chartState.xAxis.length > 0 && chartState.yAxis.length > 0 && chartType) && (
    <ChartContainer
      config={{
        value: {
          label: 'Value',
          color: 'hsl(var(--chart-1))',
        },
      }}
      className="h-5/6 w-full"
    >
    {
      SelectChart({chartData, xAxis: chartState.xAxis, yAxis: chartState.yAxis, chartType: chartType})
    }
    </ChartContainer>
  )
}


export function SelectChart({chartData, xAxis, yAxis, chartType}: {chartData: any, xAxis: Field<any>[], yAxis: Field<any>[], chartType: string}) {
  const maxHeight = chartData?.length > 0 ? Math.max(...yAxis.map((field) => Math.max(...chartData.map((item: any) => item[field.name])))) : 'dataMax'
  const minHeight = chartData?.length > 0 ? Math.min(...yAxis.map((field) => Math.min(...chartData.map((item: any) => item[field.name])))) : 'dataMin'
  switch (chartType) {
    case 'line': return (LineChartComplete(({chartData, xAxis, yAxis, maxHeight, minHeight})))
    case 'bar': return (BarChartComplete(({chartData, xAxis, yAxis, maxHeight, minHeight})))
    case 'pie': return (PieChartComplete({chartData, xAxis, yAxis, maxHeight, minHeight}))
    default: return <></>
  } 
}

interface ChartProps {
  chartData: any
  xAxis: Field<any>[]
  yAxis: Field<any>[]
  maxHeight: number | "dataMax"
  minHeight: number | "dataMin"
}

export function BarChartComplete({chartData, xAxis, yAxis, maxHeight, minHeight}: ChartProps) {
  return (  
  <BarChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey={xAxis[0].name} interval={0} angle={-70} textAnchor='end'/>
    <YAxis dataKey={yAxis[0].name} domain={[minHeight, maxHeight]} />
    <Tooltip  />
    <Legend />
    {
      yAxis.map((field) => {
        return (
          <Bar key={field.id} dataKey={field.name} fill="var(--color-value)" />
        )
      })
    }
  </BarChart>
  )
}

export function LineChartComplete({chartData, xAxis, yAxis, maxHeight, minHeight}: ChartProps) {
  return (
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey={xAxis[0].name} angle={-70} textAnchor='end'/>
    <YAxis dataKey={yAxis[0].name} domain={[minHeight, maxHeight]} />
    <Tooltip/>
    <Legend />
    {yAxis.map((field) => {
        return (
          <Line type="linear" key={field.id} dataKey={field.name} stroke="var(--color-value)" />
          // <Bar key={field.id} dataKey={field.name} fill="var(--color-value)" />
        )
      })}
  </LineChart>
  )
}

export function PieChartComplete({chartData, xAxis, yAxis}: ChartProps) {
  chartData = chartData.map((item: any) => ({name: item[xAxis[0].name], value: parseInt(item[yAxis[0].name])}))
  return (
    <PieChart>
    <Tooltip/>
    <Legend />
    {yAxis.map((field,ind) => {
        return (
          // <Pie data={chartData} key={ind} dataKey={field.name} nameKey={xAxis[0].name}></Pie>

          <Pie data={chartData} key={ind} dataKey={"value"} nameKey={"name"}></Pie>
          // <Line type="linear" key={field.id} dataKey={field.name} stroke="var(--color-value)" />
          // <Bar key={field.id} dataKey={field.name} fill="var(--color-value)" />
        )
      })}
  </PieChart>
  )
}
