'use client'

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'

const data = [
  { name: 'A', ind:1, value: 10 },
  { name: 'B', ind:2, value: 20 },
  { name: 'C', ind:3, value: 15 },
  { name: 'D', ind:4, value: 25 },
]

export default function PlaceholderChart({chartData}: {chartData: any}) {
  return (
    <ChartContainer
      config={{
        value: {
          label: 'Value',
          color: 'hsl(var(--chart-1))',
        },
      }}
      className="h-full w-full"
    >
      <LineChart data={data}>
        <Line type="linear" dataKey="value" stroke="var(--color-value)" />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ind" />
        <YAxis dataKey="value"/>
        <Bar dataKey="value" fill="var(--color-value)" />
      </LineChart>
    </ChartContainer>
  )
}

