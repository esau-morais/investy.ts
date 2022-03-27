import { useEffect, useState } from 'react'
import { defaultSymbol } from '../lib'
import { finnhubApi } from '../lib/finnhubApi'

export default function Header() {
  const [name, setName] = useState('')
  const [lastPrice, setLastPrice] = useState<number>()
  const [openPrice, setOpenPrice] = useState<number>()
  const [symbol, setSymbol] = useState('')
  const [sector, setSector] = useState('')
  const [logo, setLogo] = useState('')

  useEffect(() => {
    getMetadata()
    getLastPrice()
  }, [])

  const getMetadata = async () => {
    // fetch finnhub api to get a specific data: the quote name, symbol, and industry
    const response = await finnhubApi.get(
      `/stock/profile2?symbol=${defaultSymbol}&token=${
        import.meta.env.VITE_APP_FINNHUB_API_KEY
      }`
    )
    const data = await response.data
    setName(data.name)
    setSymbol(data.ticker)
    setSector(data.finnhubIndustry)
    setLogo(data.logo)
  }
  // fetch local api to get a specific data: the last priced updated
  const getLastPrice = async () => {
    const response = await finnhubApi.get(
      `/quote?symbol=${defaultSymbol}&token=${
        import.meta.env.VITE_APP_FINNHUB_API_KEY
      }`
    )
    const data = await response.data
    setLastPrice(data.c)
    setOpenPrice(data.o)
  }

  return (
    <div className="flex flex-col items-start justify-around py-6 space-y-4 sm:items-center sm:flex-row h-max text-rose-100/90">
      <div className="flex flex-col items-start ">
        <img
          src={logo}
          alt={name}
          loading="lazy"
          className="object-cover my-2 rounded-md w-14 h-14"
        />
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="font-medium text-rose-100/70">{symbol}</p>
      </div>
      <div className="flex flex-col items-start justify-center font-medium">
        <p className=" text-rose-100/70">Latest Price</p>
        <div>
          ${lastPrice} (
          {(((lastPrice! - openPrice!) / openPrice!) * 100).toFixed(2)})
        </div>
      </div>
      <div className="flex flex-col items-start justify-center font-medium">
        <p className=" text-rose-100/70">Sector</p>
        <div>{sector}</div>
      </div>
    </div>
  )
}
