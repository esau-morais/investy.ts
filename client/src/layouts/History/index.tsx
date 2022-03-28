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

  // fetch local api to get the history prices in a specific interval (from -> to) with the format yyyy-mm-dd
  const getHistory = async () => {
    const currentDate = new Date()
    const lastThreeMonthsDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 91 // three months ago
    )
    const formattedDate = `${format(currentDate, 'yyyy-MM-dd')}`
    const formattedYesterdaysDate = `${format(lastThreeMonthsDate, 'yyyy-MM-dd')}`

    try {
      const response = await api.get(
        `/stocks/${defaultSymbol}/history?from=${formattedYesterdaysDate}&to=${formattedDate}`
      )
      const data = await response.data
      setHistoryPrices(data.prices)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="flex items-center justify-between w-full my-4 text-rose-100/90">
        <h2 className="text-xl font-bold">Overview</h2>
        <div className="flex items-center space-x-4 font-medium justify-evenly">
          
        </div>
      </div>
      <ResponsiveContainer width="98%" height="100%">
        <ComposedChart
          data={historyPrices.map((price) => price)}
          style={{height: '48vh'}}
          margin={{
            top: 4,
            right: 8,
            left: 8,
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
    </div>
  )
}
