import { StockingAPI } from '@app/services/StockingAPI';
import { Stock } from '../entities/Stock';
import { StockNotFound } from '../errors/StockNotFound';
import { GetStockHistoryUseCase, InvalidRangeDate, StockHistory } from './GetStockHistory';

describe('GetStockHistory', () => {
  it('should calls StockingAPI to fetch history', async () => {
    const { sut, stockingAPISpies } = createSut();
    const stockHistory = await sut.execute({
      stockName: 'any',
      initialDate: new Date('2020-10-23T10:00:00.000Z'),
      finalDate: new Date('2020-10-23T14:00:00.000Z'),
    });

    expect(stockingAPISpies.fetchStockHistory).toHaveBeenCalledWith(
      'any',
      new Date('2020-10-23T10:00:00.000Z'),
      new Date('2020-10-23T14:00:00.000Z')
    );
    expect(stockHistory).toMatchObject<StockHistory>({
      stock: { name: 'any', price: 10, pricedAt: new Date('2020-10-21T13:00:00.000Z') },
      history: [
        { closing: 100, opening: 80, high: 110, low: 79, pricedAt: new Date('2020-10-21T10:00:00.000Z') },
        { closing: 110, opening: 70, high: 120, low: 50, pricedAt: new Date('2020-10-22T10:00:00.000Z') },
        { closing: 120, opening: 40, high: 130, low: 80, pricedAt: new Date('2020-10-22T10:00:00.000Z') },
      ],
    });
  });

  it('should throw an error when final date is before than initial date', async () => {
    const { sut } = createSut();

    const initialDate = new Date('2020-10-23T14:00:00.000Z');
    const finalDate = new Date('2020-10-23T10:00:00.000Z');

    const sutPromise = sut.execute({
      stockName: 'any',
      initialDate,
      finalDate,
    });

    await expect(sutPromise).rejects.toThrow(new InvalidRangeDate(initialDate, finalDate));
  });

  it('should throw the StockNotFound when stocking api returns null', async () => {
    const { sut, stockingAPISpies } = createSut();

    stockingAPISpies.fetchStockHistory.mockResolvedValue(null);

    const sutPromise = sut.execute({
      stockName: 'invalid',
      initialDate: new Date('2020-10-23T10:00:00.000Z'),
      finalDate: new Date('2020-10-23T14:00:00.000Z'),
    });

    await expect(sutPromise).rejects.toThrow(new StockNotFound('invalid'));
  });
});

function createSut() {
  const stockingAPI = new FakeStockingAPI();
  const stockingAPISpies = {
    fetchStockHistory: jest.spyOn(stockingAPI, 'fetchStockHistory'),
  };
  const sut = new GetStockHistoryUseCase(stockingAPI);

  return { sut, stockingAPISpies };
}

class FakeStockingAPI implements StockingAPI {
  async fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory | null> {
    return {
      stock: { name: name, price: 10, pricedAt: new Date('2020-10-21T13:00:00.000Z') },
      history: [
        { closing: 100, opening: 80, high: 110, low: 79, pricedAt: new Date('2020-10-21T10:00:00.000Z') },
        { closing: 110, opening: 70, high: 120, low: 50, pricedAt: new Date('2020-10-22T10:00:00.000Z') },
        { closing: 120, opening: 40, high: 130, low: 80, pricedAt: new Date('2020-10-22T10:00:00.000Z') },
      ],
    };
  }

  fetchByName(name: string): Promise<Stock> {
    throw new Error('Method not implemented.');
  }
}
