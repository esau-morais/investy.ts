import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'

export default function Graph({
  data,
  width = 500,
  height = 500,
}: {
  data: any
  width: number
  height: number
}) {
  return (
    <ResponsiveContainer width="100%" height={348}>
      <ComposedChart
        data={data.map((value: any) => value)}
        margin={{
          top: 4,
          right: 4,
          left: 4,
          bottom: 4,
        }}
      >
        <defs>
          <linearGradient id="colorClosing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffe4e6e6" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#ffe4e6b3" vertical={false} />

        {/* Displays each prices' by date on hover */}
        <Tooltip
          wrapperClassName="rounded-lg font-sans font-medium  text-white"
          contentStyle={{ backgroundColor: 'black', border: 'none' }}
        />
        {/* Displays each prices' date */}
        <XAxis dataKey="pricedAt" />
        <Area
          type="monotone"
          dataKey="closing"
          stroke="#ffe4e6e6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorClosing)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
