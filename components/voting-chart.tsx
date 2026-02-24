'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useEffect, useState } from 'react'

interface Product {
  id: string
  title: string
  vote_count: number
}

interface VotingChartProps {
  products: Product[]
}

export default function VotingChart({ products }: VotingChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const chartData = products.map(product => ({
    name: product.title.length > 15 ? product.title.substring(0, 15) + '...' : product.title,
    votes: product.vote_count,
    fullName: product.title,
  }))

  if (!isMounted) {
    return <div className="w-full h-80 bg-secondary/50 rounded-lg animate-pulse" />
  }

  // Get theme colors from CSS variables
  const getColor = (cssVar: string) => {
    if (typeof window === 'undefined') return '#000'
    return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350} minWidth={300}>
        <BarChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            vertical={false}
          />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value) => [`${value} votes`, 'Total']}
            labelFormatter={(label) => {
              const product = chartData.find((d) => d.name === label)
              return product?.fullName || label
            }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar
            dataKey="votes"
            fill="hsl(var(--accent))"
            radius={[8, 8, 0, 0]}
            animationDuration={500}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill="hsl(var(--accent))" 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
