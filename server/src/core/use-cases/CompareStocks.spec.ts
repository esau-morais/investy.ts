import { StockingAPI } from '@app/services/StockingAPI';
import { Stock } from '../entities/Stock';
import { StockNotFound } from '../errors/StockNotFound';
import { CompareStocksUseCase } from './CompareStocks';
import { StockHistory } from './GetStockHistory';

describe('CompareStocksUseCase', () => {
  it('should return a list of stocks given their names', async () => {
    const { sut, stockingAPISpies } = createSut();
    stockingAPISpies.fetchByName
      .mockResolvedValueOnce(new Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }))
      .mockResolvedValueOnce(new Stock({ name: 'any 2', price: 11, pricedAt: new Date('2020-10-11') }))
      .mockResolvedValueOnce(new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }));

    const stocks = await sut.execute({
      stockNameComparing: 'any',
      stockNamesToCompare: ['any 2', 'any 3'],
    });

    expect(stocks).toEqual([
      new Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }),
      new Stock({ name: 'any 2', price: 11, pricedAt: new Date('2020-10-11') }),
      new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }),
    ]);
  });

  it('should remove of stocks result the stock names that not exists', async () => {
    const { sut, stockingAPISpies } = createSut();
    stockingAPISpies.fetchByName
      .mockResolvedValueOnce(new Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }))
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }));

    const stocks = await sut.execute({
      stockNameComparing: 'any',
      stockNamesToCompare: ['any 2', 'any 3'],
    });

    expect(stocks).toEqual([
      new Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }),
      new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }),
    ]);
  });

  it('should throws an error when the stock comparing not exists', async () => {
    const { sut, stockingAPISpies } = createSut();
    stockingAPISpies.fetchByName
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(new Stock({ name: 'any 2', price: 10, pricedAt: new Date('2020-10-10') }))
      .mockResolvedValueOnce(new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }));

    const sutPromise = sut.execute({
      stockNameComparing: 'any',
      stockNamesToCompare: ['any 2', 'any 3'],
    });

    await expect(sutPromise).rejects.toThrow(new StockNotFound('any'));
  });
});

function createSut() {
  const stockingAPI = new FakeStockingAPI();
  const fetchByName = jest.spyOn(stockingAPI, 'fetchByName');
  const sut = new CompareStocksUseCase(stockingAPI);
  return { sut, stockingAPISpies: { fetchByName } };
}

class FakeStockingAPI implements StockingAPI {
  fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory> {
    throw new Error('Method not implemented.');
  }

  async fetchByName(name: string): Promise<Stock | null> {
    throw new Error('Method not implemented.');
  }
}
