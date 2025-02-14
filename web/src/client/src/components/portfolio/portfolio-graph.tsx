'use client';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface PortfolioGraphProps {
  data: {
    date: string;
    value: number;
  }[];
}

export const PortfolioGraph = ({ data }: PortfolioGraphProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="border-b border-white/10 pb-4 text-xl text-white">
        Portfolio Value
      </h2>
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#AAAABF"
              opacity={0.1}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={{ stroke: '#AAAABF', opacity: 0.2 }}
              tickLine={false}
              tick={{ fill: '#AAAABF', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={{ stroke: '#AAAABF', opacity: 0.2 }}
              tickLine={false}
              tick={{ fill: '#AAAABF', fontSize: 12 }}
              dx={-10}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg bg-background-secondary p-2 shadow-lg">
                      <p className="text-sm text-text-secondary">
                        {payload[0].payload.date}
                      </p>
                      <p className="text-base font-medium text-white">
                        ${payload[0]?.value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#7C3AED"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
