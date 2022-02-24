import { Stock } from '@app/core/entities/Stock';
import { StockHistory } from '@app/core/use-cases/GetStockHistory';
import { StockingAPI } from './StockingAPI';

import axios, { AxiosInstance } from 'axios';
import { Clock } from '@app/shared/Clock';
import { HistoryPrice } from '@app/core/entities/HistoryPrice';

export const alphaVantageApi = axios.create({
  baseURL: 'https://www.alphavantage.co',
});

export class AlphaVantageStockingAPI implements StockingAPI {
  constructor(private apiKey?: string) {
    if (!this.apiKey) throw new APIKeyNotProvidedError();
  }

  async fetchByName(name: string): Promise<Stock | null> {
    const url = `/query?function=GLOBAL_QUOTE&symbol=${name}&apikey=${this.apiKey}`;
    const { data } = await alphaVantageApi.get<any>(url);
    const info = data['Global Quote'];

    if (!info || !info['01. symbol']) return null;

    return new Stock({
      name: info['01. symbol'],
      price: Number(info['05. price']),
      pricedAt: new Date(info['07. latest trading day']),
    });
  }

  async fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory | null> {
    if (Clock.isAfterNow(finalDate)) throw new FinalDateInvalidError(finalDate);

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${name}&outputsize=full&apikey=${this.apiKey}`;
    const { data } = await alphaVantageApi.get<any>(url);

    const historyData = data['Time Series (Daily)'] as { [key: string]: any };
    if (!historyData) return null;

    const entries = Object.entries(historyData);
    if (finalDateIsBeforeTheFirstEntry()) return emptyHistory();

    const { startIndex, finalIndex } = getRangeIndex();
    const entriesWithinRangeDate = entries.slice(startIndex, finalIndex + 1);

    return {
      stockName: name,
      history: entriesWithinRangeDate.map(createHistoryPriceFromEntry),
    };

    function createHistoryPriceFromEntry(entry: [string, any]) {
      const [dateStr, values] = entry;
      return new HistoryPrice({
        opening: Number(values['1. open']),
        closing: Number(values['4. close']),
        low: Number(values['3. low']),
        high: Number(values['2. high']),
        volume: Number(values['5. volume']),
        pricedAt: new Date(dateStr),
      });
    }

    function getRangeDate() {
      const initialDateStr = getInitialDateStr(initialDate, historyData);
      const finalDateStr = getFinalDateStr(finalDate, historyData);
      return { initialDateStr, finalDateStr };
    }

    function getRangeIndex() {
      const { initialDateStr, finalDateStr } = getRangeDate();
      const finalIndex = entries.findIndex(([dateStr]) => initialDateStr === dateStr);
      const startIndex = entries.findIndex(([dateStr]) => finalDateStr === dateStr);
      return { startIndex, finalIndex };
    }

    function finalDateIsBeforeTheFirstEntry() {
      const dateOfFirstEntry = new Date(entries[entries.length - 1][0]);
      return Clock.isBefore(finalDate, dateOfFirstEntry);
    }

    function emptyHistory() {
      return {
        stockName: name,
        history: [],
      };
    }
  }
}

function getInitialDateStr(initialDate: Date, historyData: any) {
  let date = initialDate;
  let dateStr = Clock.format(date, 'yyyy-MM-dd');

  while (true) {
    if (historyData[dateStr]) break;

    date = Clock.addDays(date, 1);
    dateStr = Clock.format(date, 'yyyy-MM-dd');
  }

  return dateStr;
}

function getFinalDateStr(finalDate: Date, historyData: any) {
  let date = finalDate;
  let dateStr = Clock.format(date, 'yyyy-MM-dd');

  while (true) {
    if (historyData[dateStr]) break;

    date = Clock.subtractDays(date, 1);
    dateStr = Clock.format(date, 'yyyy-MM-dd');
  }

  return dateStr;
}

export class APIKeyNotProvidedError extends Error {
  constructor() {
    super('The alpha vantage api need an API key');
  }
}

export class FinalDateInvalidError extends Error {
  constructor(date: Date) {
    super(`The final date ${date.toUTCString()} is invalid.`);
  }
}
