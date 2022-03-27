import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from 'recharts'
import { api, defaultSymbol } from '../../lib'

export default function History() {
  const [historyPrices, setHistoryPrices] = useState<Array<any>>([])

  useEffect(() => {
    getHistory()
  }, [])

  // fetch local api to get the history prices in a specific interval (from -> to) with this format yyyy-mm-dd
  const getHistory = async () => {
    const currentDate = new Date()
    const formattedDate = `${format(currentDate, 'yyyy-MM-dd')}`

    try {
      const response = await api.get(
        `/stocks/${defaultSymbol}/history?from=2022-01-01&to=${formattedDate}`
      )
      const data = await response.data
      setHistoryPrices(data.prices)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex items-center justify-center my-8">
      <ResponsiveContainer width="96%" height={396}>
        <ComposedChart
          data={historyPrices.map((price) => price)}
          margin={{
            top: 4,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorClosing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffe4e6e6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ffe4e6b3" vertical={false} />

          <Tooltip
            wrapperClassName="rounded-lg font-sans font-medium  text-white"
            contentStyle={{ backgroundColor: 'black', border: 'none' }}
          />
          <XAxis
            dataKey="pricedAt"
          />
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
    </div>
  )
}
