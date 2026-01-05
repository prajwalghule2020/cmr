import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MiniTrendChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniTrendChart({ data, color = 'hsl(var(--accent))', height = 40 }: MiniTrendChartProps) {
  const chartData = data.map((value, index) => ({
    month: index,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-popover border border-border rounded px-2 py-1 text-xs">
                  {payload[0].value}
                </div>
              );
            }
            return null;
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
