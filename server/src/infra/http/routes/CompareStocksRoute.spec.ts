import { Stock } from '@app/core/entities/Stock';
import { CompareStocksUseCase } from '@app/core/use-cases/CompareStocks';
import { StockHistory } from '@app/core/use-cases/GetStockHistory';
import { CompareStocksViewModel } from '@app/presentation/CompareStocksViewModel';
import { StockingAPI } from '@app/services/StockingAPI';
import { parseViewModel } from '@app/__tests__/helpers';
import { HttpRequest } from '../HttpRequest';
import { CompareStocksRoute, InvalidStocksToCompareError } from './CompareStocksRoute';

describe('CompareStocksRoute', () => {
  it('should return correct model view', async () => {
    const { sut, useCaseSpies } = createSut();
    useCaseSpies.execute.mockResolvedValue([
      new Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }),
      new Stock({ name: 'any 2', price: 11, pricedAt: new Date('2020-10-11') }),
      new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }),
    ]);
    const httpRequest = new HttpRequest({
      params: { stockName: 'any' },
      query: { stocksToCompare: ['any 2', 'any 3'] },
    });

    const response = await sut.handle(httpRequest);

    expect(useCaseSpies.execute).toHaveBeenCalledWith({
      stockNameComparing: 'any',
      stockNamesToCompare: ['any 2', 'any 3'],
    });
    expect(response.statusCode).toBe(200);
    const body = parseViewModel(response.body as CompareStocksViewModel);
    expect(body).toMatchObject({
      lastPrices: [
        { name: 'any', lastPrice: 10, pricedAt: '2020-10-10' },
        { name: 'any 2', lastPrice: 11, pricedAt: '2020-10-11' },
        { name: 'any 3', lastPrice: 12, pricedAt: '2020-10-12' },
      ],
    });
  });

  it('should return 400 status code when stocks to compare isn"t provided', async () => {
    const { sut, useCaseSpies } = createSut();
    useCaseSpies.execute.mockResolvedValue([
      new Stock({ name: 'any', price: 10, pricedAt: new Date('2020-10-10') }),
      new Stock({ name: 'any 2', price: 11, pricedAt: new Date('2020-10-11') }),
      new Stock({ name: 'any 3', price: 12, pricedAt: new Date('2020-10-12') }),
    ]);
    const httpRequest = new HttpRequest({
      params: { stockName: 'any' },
    });

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      message: new InvalidStocksToCompareError().message,
    });
  });
});

function createSut() {
  const stockingAPI = new FakeStockingAPI();
  const compareStocksUseCase = new CompareStocksUseCase(stockingAPI);
  const executeSpy = jest.spyOn(compareStocksUseCase, 'execute');

  const sut = new CompareStocksRoute(compareStocksUseCase);

  return { sut, useCaseSpies: { execute: executeSpy } };
}

class FakeStockingAPI implements StockingAPI {
  fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory> {
    throw new Error('Method not implemented.');
  }

  async fetchByName(name: string): Promise<Stock | null> {
    throw new Error('Method not implemented.');
  }
}
