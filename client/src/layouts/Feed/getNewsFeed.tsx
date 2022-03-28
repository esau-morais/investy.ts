import { finnhubApi } from '../../lib/finnhubApi'

export const getNewsFeed = async () => {
  try {
    const response = await finnhubApi.get(
      `/news?category=forex&minId=10&token=${process.env.VITE_APP_FINNHUB_API_KEY}`
    )
    if (response.status !== 200) {
      throw new Error('Something went wrong')
    }
    const data = await response.data
    return data
  } catch (error) {
    console.log(error)
  }
}
