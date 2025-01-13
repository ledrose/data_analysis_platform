'use client'

import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { Field } from '@/api/charts'
import { useMemo } from 'react'

const COLORS = [
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600"
  ];

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
  const data = useMemo(() =>{ 
    for (let i = 0; i < yAxis.length; i++) {
      chartData =chartData.map((item: any) => ({
        ...item,
        [yAxis[i].name]: parseFloat(item[yAxis[i].name]),
      }))
    }
    return chartData
  },[chartData]);
  console.log(chartData)
  const maxHeight = chartData?.length > 0 ? Math.max(...yAxis.map((field) => Math.max(...chartData.map((item: any) => item[field.name])))) : 'dataMax'
  const minHeight = chartData?.length > 0 ? Math.min(...yAxis.map((field) => Math.min(...chartData.map((item: any) => item[field.name])))) : 'dataMin'
  switch (chartType) {
    case 'line': return (LineChartComplete(({chartData: data, xAxis, yAxis, maxHeight, minHeight})))
    case 'bar': return (BarChartComplete(({chartData: data, xAxis, yAxis, maxHeight, minHeight})))
    case 'pie': return (PieChartComplete({chartData: data, xAxis, yAxis, maxHeight, minHeight}))
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
    {yAxis.map((field,index) => {
        return (
          <Line type="linear" key={field.id} dataKey={field.name} stroke={COLORS[COLORS.length -1 -(index % COLORS.length)]} />
          // <Bar key={field.id} dataKey={field.name} fill="var(--color-value)" />
        )
      })}
  </LineChart>
  )
}


export function PieChartComplete({chartData, xAxis, yAxis}: ChartProps) {
  return (
    <PieChart>
    <Tooltip/>
    <Legend />
    {yAxis.map((field,ind) => {
        return (
          <Pie data={chartData} key={ind} dataKey={field.name} nameKey={xAxis[0].name} paddingAngle={1} fill='var(--color-value)'>
            {chartData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[COLORS.length -1 -(index % COLORS.length)]} />
          ))}
          </Pie>
        )
      })}
  </PieChart>
  )
}
