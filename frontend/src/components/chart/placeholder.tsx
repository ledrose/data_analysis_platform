'use client'

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { Field } from '@/app/charts/page'

const data = [
  { name: 'A', ind:1, value: 10 },
  { name: 'B', ind:2, value: 20 },
  { name: 'C', ind:3, value: 15 },
  { name: 'D', ind:4, value: 25 },
]

export default function PlaceholderChart({chartData, chartState, chartType}: {chartData: any, chartState: Record<string, Field[]>, chartType: string}) {
  return (
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


export function SelectChart({chartData, xAxis, yAxis, chartType}: {chartData: any, xAxis: Field[], yAxis: Field[], chartType: string}) {
  switch (chartType) {
    case 'line': return (LineChartComplete({chartData: chartData, xAxis: xAxis, yAxis: yAxis}))
    case 'bar': return (BarChartComplete({chartData: chartData, xAxis: xAxis, yAxis: yAxis}))
    case 'pie': return (PieChartComplete({chartData: chartData, xAxis: xAxis, yAxis: yAxis}))
    default: return <></>
  } 
}

export function BarChartComplete({chartData, xAxis, yAxis}: {chartData: any, xAxis: Field[], yAxis: Field[]}) {

  const maxHeight = chartData?.length > 0 ? Math.max(...chartData.map((item: any) => item[yAxis[0].name])) : 'dataMax'
  return (  
  <BarChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey={xAxis[0].name} interval={0} angle={-70} textAnchor='end'/>
    <YAxis dataKey={yAxis[0].name} domain={['dataMin', maxHeight]} />
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

export function LineChartComplete({chartData, xAxis, yAxis}: {chartData: any, xAxis: Field[], yAxis: Field[]}) {
  return (
  <LineChart data={data}>
    <Line type="linear" dataKey="value" stroke="var(--color-value)" />
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="ind" />
    <YAxis dataKey="value"/>
    <Bar dataKey="value" fill="var(--color-value)" />
  </LineChart>
  )
}

export function PieChartComplete({chartData, xAxis, yAxis}: {chartData: any, xAxis: Field[], yAxis: Field[]}) {
  return (
  <LineChart data={data}>
    <Line type="linear" dataKey="value" stroke="var(--color-value)" />
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="ind" />
    <YAxis dataKey="value"/>
    <Bar dataKey="value" fill="var(--color-value)" />
  </LineChart>
  )
}
