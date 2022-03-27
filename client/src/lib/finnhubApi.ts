import axios from 'axios'

// define the main api url
const finnhubApi = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

export { finnhubApi }

