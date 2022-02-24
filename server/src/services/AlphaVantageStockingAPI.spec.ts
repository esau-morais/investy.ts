import { Stock } from '@app/core/entities/Stock';
import { Clock } from '@app/shared/Clock';
import {
  alphaVantageApi,
  AlphaVantageStockingAPI,
  APIKeyNotProvidedError,
  FinalDateInvalidError,
} from './AlphaVantageStockingAPI';

import { IBM_STOCK_DAILY_HISTORY } from '@app/__tests__/fixtures/stock-history-sample';
import { HistoryPrice } from '@app/core/entities/HistoryPrice';

describe('AlphaVantageStockingAPI', () => {
  it('should throws an error if API key isn"t provided', () => {
    expect(() => {
      // @ts-ignore
      new AlphaVantageStockingAPI();
    }).toThrow(new APIKeyNotProvidedError());
  });

  describe('fetchByName', () => {
    it('should return an stock instance', async () => {
      const apiGetSpy = jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(validStockResponse());

      const sut = new AlphaVantageStockingAPI('any');
      const stock = await sut.fetchByName('any_stock');

      expect(apiGetSpy).toHaveBeenCalledWith(`/query?function=GLOBAL_QUOTE&symbol=any_stock&apikey=any`);
      expect(stock).toBeInstanceOf(Stock);
      expect(stock).toEqual({
        name: 'any_stock',
        price: 127.88,
        pricedAt: new Date('2021-10-22'),
      });
    });

    it('should returns null when not return stock info', async () => {
      jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(emptyStockResponse());

      const sut = new AlphaVantageStockingAPI('any');
      const stock = await sut.fetchByName('any_stock');

      expect(stock).toBeNull();
    });
  });

  describe('fetchStockHistory', () => {
    it('should throws an error if final date is after then today', async () => {
      jest.spyOn(Clock, 'now').mockReturnValue(new Date('2021-10-22'));
      const sut = new AlphaVantageStockingAPI('any');
      const invalidFinalDate = new Date('2021-10-25');
      const promise = sut.fetchStockHistory('any_stock', new Date('2021-10-11'), invalidFinalDate);
      await expect(promise).rejects.toThrow(new FinalDateInvalidError(invalidFinalDate));
    });

    it('should get history correctly when the range date is within of response', async () => {
      const apiGetSpy = jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(validHistoryResponse());

      const sut = new AlphaVantageStockingAPI('any');
      const history = await sut.fetchStockHistory('any_stock', new Date('2021-10-06'), new Date('2021-10-22'));

      expect(apiGetSpy).toHaveBeenCalledWith(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=any_stock&outputsize=full&apikey=any`
      );
      expect(history).toEqual({
        stockName: 'any_stock',
        history: [
          new HistoryPrice({
            opening: 128.05,
            high: 130.25,
            low: 126.611,
            closing: 127.88,
            volume: 11582195,
            pricedAt: new Date('2021-10-22'),
          }),
          new HistoryPrice({
            opening: 133.51,
            high: 133.72,
            low: 128.1,
            closing: 128.33,
            volume: 31466529,
            pricedAt: new Date('2021-10-21'),
          }),
          new HistoryPrice({
            opening: 141.68,
            high: 142.2,
            low: 140.7,
            closing: 141.9,
            volume: 6189255,
            pricedAt: new Date('2021-10-20'),
          }),
          new HistoryPrice({
            opening: 141.08,
            high: 142.94,
            low: 140.5201,
            closing: 141.98,
            volume: 4339548,
            pricedAt: new Date('2021-10-19'),
          }),
          new HistoryPrice({
            opening: 144.0,
            high: 144.94,
            low: 141.759,
            closing: 142.32,
            volume: 6154055,
            pricedAt: new Date('2021-10-18'),
          }),
          new HistoryPrice({
            opening: 143.39,
            high: 144.85,
            low: 142.79,
            closing: 144.61,
            volume: 3222778,
            pricedAt: new Date('2021-10-15'),
          }),
          new HistoryPrice({
            opening: 141.04,
            high: 143.92,
            low: 141.01,
            closing: 143.39,
            volume: 4217305,
            pricedAt: new Date('2021-10-14'),
          }),
          new HistoryPrice({
            opening: 140.52,
            high: 141.41,
            low: 139.66,
            closing: 140.76,
            volume: 2880747,
            pricedAt: new Date('2021-10-13'),
          }),
          new HistoryPrice({
            opening: 142.21,
            high: 142.3,
            low: 140.3,
            closing: 140.47,
            volume: 3148559,
            pricedAt: new Date('2021-10-12'),
          }),
          new HistoryPrice({
            opening: 143.5,
            high: 144.08,
            low: 142.4,
            closing: 142.43,
            volume: 2793298,
            pricedAt: new Date('2021-10-11'),
          }),
          new HistoryPrice({
            opening: 141.81,
            high: 143.65,
            low: 141.05,
            closing: 143.22,
            volume: 3731279,
            pricedAt: new Date('2021-10-08'),
          }),
          new HistoryPrice({
            opening: 142.73,
            high: 143.395,
            low: 141.53,
            closing: 141.81,
            volume: 3823803,
            pricedAt: new Date('2021-10-07'),
          }),
          new HistoryPrice({
            opening: 142.48,
            high: 143.37,
            low: 140.89,
            closing: 142.36,
            volume: 5328433,
            pricedAt: new Date('2021-10-06'),
          }),
        ],
      });
    });

    it('should get history correctly when the initial date isn"t within of response, but final does', async () => {
      jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(validHistoryResponse());

      const sut = new AlphaVantageStockingAPI('any');
      const history = await sut.fetchStockHistory('any_stock', new Date('2021-10-02'), new Date('2021-10-13'));

      expect(history).toEqual({
        stockName: 'any_stock',
        history: [
          new HistoryPrice({
            opening: 140.52,
            high: 141.41,
            low: 139.66,
            closing: 140.76,
            volume: 2880747,
            pricedAt: new Date('2021-10-13'),
          }),
          new HistoryPrice({
            opening: 142.21,
            high: 142.3,
            low: 140.3,
            closing: 140.47,
            volume: 3148559,
            pricedAt: new Date('2021-10-12'),
          }),
          new HistoryPrice({
            opening: 143.5,
            high: 144.08,
            low: 142.4,
            closing: 142.43,
            volume: 2793298,
            pricedAt: new Date('2021-10-11'),
          }),
          new HistoryPrice({
            opening: 141.81,
            high: 143.65,
            low: 141.05,
            closing: 143.22,
            volume: 3731279,
            pricedAt: new Date('2021-10-08'),
          }),
          new HistoryPrice({
            opening: 142.73,
            high: 143.395,
            low: 141.53,
            closing: 141.81,
            volume: 3823803,
            pricedAt: new Date('2021-10-07'),
          }),
          new HistoryPrice({
            opening: 142.48,
            high: 143.37,
            low: 140.89,
            closing: 142.36,
            volume: 5328433,
            pricedAt: new Date('2021-10-06'),
          }),
          new HistoryPrice({
            opening: 144.75,
            high: 145.0,
            low: 142.64,
            closing: 143.15,
            volume: 6976648,
            pricedAt: new Date('2021-10-05'),
          }),
          new HistoryPrice({
            opening: 142.74,
            high: 146.0,
            low: 142.3501,
            closing: 144.11,
            volume: 7351128,
            pricedAt: new Date('2021-10-04'),
          }),
        ],
      });
    });

    it('should get history correctly when the final date isn"t within of response, but initial does', async () => {
      jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(validHistoryResponse());

      const sut = new AlphaVantageStockingAPI('any');
      const history = await sut.fetchStockHistory('any_stock', new Date('2021-10-11'), new Date('2021-10-17'));

      expect(history).toEqual({
        stockName: 'any_stock',
        history: [
          new HistoryPrice({
            opening: 143.39,
            high: 144.85,
            low: 142.79,
            closing: 144.61,
            volume: 3222778,
            pricedAt: new Date('2021-10-15'),
          }),
          new HistoryPrice({
            opening: 141.04,
            high: 143.92,
            low: 141.01,
            closing: 143.39,
            volume: 4217305,
            pricedAt: new Date('2021-10-14'),
          }),
          new HistoryPrice({
            opening: 140.52,
            high: 141.41,
            low: 139.66,
            closing: 140.76,
            volume: 2880747,
            pricedAt: new Date('2021-10-13'),
          }),
          new HistoryPrice({
            opening: 142.21,
            high: 142.3,
            low: 140.3,
            closing: 140.47,
            volume: 3148559,
            pricedAt: new Date('2021-10-12'),
          }),
          new HistoryPrice({
            opening: 143.5,
            high: 144.08,
            low: 142.4,
            closing: 142.43,
            volume: 2793298,
            pricedAt: new Date('2021-10-11'),
          }),
        ],
      });
    });

    it('should get history since than first entry when initial date is before that first entry', async () => {
      jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(validHistoryResponse());

      const sut = new AlphaVantageStockingAPI('any');
      const initialDateBeforeFirstEntry = new Date('2021-04-11');
      const history = await sut.fetchStockHistory('any_stock', initialDateBeforeFirstEntry, new Date('2021-05-13'));

      expect(history).toEqual({
        stockName: 'any_stock',
        history: [
          new HistoryPrice({
            opening: 141.45,
            high: 144.9,
            low: 141.28,
            closing: 144.17,
            volume: 4598920,
            pricedAt: new Date('2021-05-13'),
          }),
          new HistoryPrice({
            opening: 143.84,
            high: 144.15,
            low: 141.14,
            closing: 141.3,
            volume: 5959579,
            pricedAt: new Date('2021-05-12'),
          }),
          new HistoryPrice({
            opening: 144.99,
            high: 145.19,
            low: 142.9,
            closing: 144.22,
            volume: 7126404,
            pricedAt: new Date('2021-05-11'),
          }),
        ],
      });
    });

    it('should empty history when final date is before the first entry', async () => {
      jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(validHistoryResponse());

      const sut = new AlphaVantageStockingAPI('any');
      const initialDateBeforeFirstEntry = new Date('2021-04-11');
      const finalDateBeforeFirstEntry = new Date('2021-04-20');

      const history = await sut.fetchStockHistory('any_stock', initialDateBeforeFirstEntry, finalDateBeforeFirstEntry);

      expect(history).toEqual({
        stockName: 'any_stock',
        history: [],
      });
    });

    it('should returns null when history data ins"t returned', async () => {
      jest.spyOn(alphaVantageApi, 'get').mockResolvedValue(emptyHistoryResponse());

      const sut = new AlphaVantageStockingAPI('any');
      const history = await sut.fetchStockHistory('any_stock', new Date('2021-10-11'), new Date('2021-10-17'));
      expect(history).toBeNull();
    });
  });
});

function validStockResponse() {
  return {
    data: {
      'Global Quote': {
        '01. symbol': 'any_stock',
        '02. open': '128.0500',
        '03. high': '130.2500',
        '04. low': '126.6110',
        '05. price': '127.8800',
        '06. volume': '11582195',
        '07. latest trading day': '2021-10-22',
        '08. previous close': '128.3300',
        '09. change': '-0.4500',
        '10. change percent': '-0.3507%',
      },
    },
  };
}

function emptyStockResponse() {
  return {
    data: {
      'Global Quote': {},
    },
  };
}

function validHistoryResponse() {
  return {
    data: IBM_STOCK_DAILY_HISTORY,
  };
}

function emptyHistoryResponse() {
  return {
    data: {
      'Error Message':
        'Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_DAILY.',
    },
  };
}
