import axios from 'axios'

// define the main api url (local)
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

const defaultSymbol = 'AAPL'

export { api, defaultSymbol }

