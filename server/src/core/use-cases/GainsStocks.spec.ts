import { StockingAPI } from '@app/services/StockingAPI';
import { Clock } from '@app/shared/Clock';
import { HistoryPrice } from '../entities/HistoryPrice';
import { Stock } from '../entities/Stock';
import { StockNotFound } from '../errors/StockNotFound';
import { GainsStocksUseCase } from './GainsStocks';
import { StockHistory } from './GetStockHistory';

describe('GainsStocksUseCase', () => {
  it('should returns the correct gains', async () => {
    const today = new Date('2021-10-20');
    jest.spyOn(Clock, 'now').mockReturnValue(today);

    const { sut, stockingAPISpies } = createSut();

    const purchasedAt = new Date('2021-10-06');
    const result = await sut.execute({ purchasedAmount: 100, purchasedAt, stockName: 'any' });

    expect(stockingAPISpies.fetchStockHistory).toHaveBeenCalledWith('any', new Date('2021-10-06'), today);
    expect(result).toEqual({
      name: 'any',
      purchasedAmount: 100,
      purchasedAt: purchasedAt,
      priceAtDate: 142.36,
      lastPrice: 127.88,
      capitalGains: -1448.0000000000018,
    });
  });

  it('should throw the StockNotFound when a stock name that not exists is provided', async () => {
    const { sut, stockingAPISpies } = createSut();

    const purchasedAt = new Date('2021-10-06');
    stockingAPISpies.fetchStockHistory.mockResolvedValue(null);
    const sutPromise = sut.execute({ purchasedAmount: 100, purchasedAt, stockName: 'any' });

    await expect(sutPromise).rejects.toThrow(new StockNotFound('any'));
  });
});

function createSut() {
  const stockingAPI = new FakeStockingAPI();
  const fetchStockHistorySpy = jest.spyOn(stockingAPI, 'fetchStockHistory');
  const sut = new GainsStocksUseCase(stockingAPI);
  return { sut, stockingAPISpies: { fetchStockHistory: fetchStockHistorySpy } };
}

class FakeStockingAPI implements StockingAPI {
  fetchByName(name: string): Promise<Stock | null> {
    throw new Error('Method not implemented.');
  }
  async fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory | null> {
    return {
      stockName: name,
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
    };
  }
}
