import { useEffect, useState } from 'react'
import { finnhubApi } from '../../lib/finnhubApi'
import Quote from '../Card'

export default function Feed() {
  const [results, setResults] = useState<Array<any>>([])

  useEffect(() => {
    getNewsFeed()
  }, [])

  // fetch from finnhub api a news feed
  const getNewsFeed = async () => {
    try {
      const response = await finnhubApi.get(
        `/news?category=forex&minId=10&token=${
          import.meta.env.VITE_APP_FINNHUB_API_KEY
        }`
      )
      const data = await response.data
      setResults(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="px-4 my-8 text-rose-100/90">
      <h1 className="flex items-start mb-4 text-2xl font-bold">Market News</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {results.map((result) => (
          <Quote key={result.id}>
            <Quote.Anchor
              href={result.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                src={result.image === '' ? '/Cover.png' : result.image}
                alt={result.headline}
                loading="lazy"
              />
              <Quote.Title>{result.headline}</Quote.Title>
              <Quote.Text>{result.summary}</Quote.Text>
            </Quote.Anchor>
          </Quote>
        ))}
      </div>
    </div>
  )
}
