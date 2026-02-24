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
} from 'recharts'

interface Product {
  id: string
  title: string
  vote_count: number
}

interface VotingChartProps {
  products: Product[]
}

export default function VotingChart({ products }: VotingChartProps) {
  const chartData = products.map(product => ({
    name: product.title.substring(0, 12),
    votes: product.vote_count,
    fullName: product.title,
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="name"
            stroke="var(--color-foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="var(--color-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--color-foreground)' }}
            formatter={(value) => [`${value} votes`, 'Votes']}
            cursor={{ fill: 'rgba(var(--color-primary), 0.1)' }}
          />
          <Legend />
          <Bar
            dataKey="votes"
            fill="var(--color-primary)"
            radius={[8, 8, 0, 0]}
            name="Votes"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
