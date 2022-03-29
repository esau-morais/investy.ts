import { format } from 'date-fns'
import { ChangeEvent, useEffect, useState } from 'react'
import Quote from '../Card'
import Search from './Search'

export default function Compare() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<Array<any>>([])

  const currentDate = new Date()
  const yesterday = currentDate.setDate(currentDate.getDate() - 1)
  const formattedDate = `${format(yesterday, 'yyyy-MM-dd')}`
  const prettierFormatDate = `${format(yesterday, 'MMM do, yyyy')}`

  useEffect(() => {
    getGroupedDaily()
  }, [])

  // fetch from polygon api a list of stocks by la  st updated date (yyyy-mm-dd)
  const getGroupedDaily = async () => {
    const response = await fetch(
      `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${formattedDate}?queryCount=20&apiKey=${
        import.meta.env.VITE_APP_POLYGON_API_KEY
      }`
    )
    const data = await response.json()
    console.log(data)
    setResults(data.results)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    setKeyword(e.target.value.toLowerCase())
  }
  return (
    <div className="px-4 text-rose-100/90">
      <h1 className="flex items-start mb-4 text-2xl font-bold">
        Stocks{' '}
        <span className="inline-flex items-center justify-center px-2 py-1 ml-[5px] text-sm font-bold leading-none text-indigo-100 rounded bg-purple-500/70">
          {prettierFormatDate}
        </span>
      </h1>

      {/* Search bar */}
      <Search onChange={handleInputChange} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {results
          .filter((result) => {
            if (result === '') return result
            else if (result.T.toLowerCase().includes(keyword.toLowerCase()))
              return result
          })
          .slice(0, 18)
          .map((result, index) => {
            const gainOrLossPercentage =
              ((result.c - result.o) / result.o) * 100
            return (
              <Quote key={index}>
                <Quote.Title>{result.T}</Quote.Title>
                <Quote.Text>
                  ${result.c}{' '}
                  <span
                    className={`text-sm ${
                      gainOrLossPercentage > 0 && 'text-green-400'
                    } ${gainOrLossPercentage < 0 && 'text-red-400'}`}
                  >
                    {Number(gainOrLossPercentage).toFixed(2)}%
                  </span>
                </Quote.Text>
              </Quote>
            )
          })}
      </div>
    </div>
  )
}
