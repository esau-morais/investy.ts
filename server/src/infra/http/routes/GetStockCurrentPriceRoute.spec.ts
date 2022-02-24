import { Stock } from '@app/core/entities/Stock';
import { StockNotFound } from '@app/core/errors/StockNotFound';
import { GetStockCurrentPriceUseCase } from '@app/core/use-cases/GetStockCurrentPrice';
import { StockHistory } from '@app/core/use-cases/GetStockHistory';
import { ViewModel } from '@app/presentation';
import { StockViewModel } from '@app/presentation/StockViewModel';
import { StockingAPI } from '@app/services/StockingAPI';
import { MissingParamError } from '@app/shared/errors/MissingParamError';
import { parseViewModel } from '@app/__tests__/helpers';
import { HttpRequest } from '../HttpRequest';
import { GetStockCurrentPriceRoute } from './GetStockCurrentPriceRoute';

describe('GetStockCurrentPriceRoute', () => {
  it('should returns a stock view model when is a stock name valid', async () => {
    const { sut } = createSut();

    const request = new HttpRequest({
      params: {
        stockName: 'any',
      },
    });
    const response = await sut.handle(request);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(StockViewModel);

    const parsed = parseViewModel(response.body as ViewModel<any>);
    expect(parsed).toMatchObject({
      name: 'any',
      lastPrice: 50,
      pricedAt: '2021-10-22',
    });
  });

  it('should returns a 400 when invalid stock name is provided', async () => {
    const { sut } = createSut();
    const request = new HttpRequest({
      params: {
        stockName: ' ',
      },
    });
    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({ message: new MissingParamError('stockName').message });
  });

  it('should returns 404 status code when stock information isn"t found', async () => {
    const { sut, stockingAPISpies } = createSut();
    stockingAPISpies.fetchByName.mockResolvedValue(null);
    const request = new HttpRequest({
      params: {
        stockName: 'invalid',
      },
    });

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({ message: new StockNotFound('invalid').message });
  });
});

function createSut() {
  const stockingAPI = new FakeStockingAPI();
  const getCurrentPriceUseCase = new GetStockCurrentPriceUseCase(stockingAPI);
  const sut = new GetStockCurrentPriceRoute(getCurrentPriceUseCase);

  const stockingAPISpies = {
    fetchByName: jest.spyOn(stockingAPI, 'fetchByName'),
  };

  return { sut, stockingAPISpies };
}

function createFakeStock(name: string) {
  return new Stock({ name, price: 50, pricedAt: new Date('2021-10-22T10:10:00.000Z') });
}

class FakeStockingAPI implements StockingAPI {
  async fetchByName(name: string): Promise<Stock | null> {
    return createFakeStock(name);
  }
  fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory> {
    throw new Error('Method not implemented.');
  }
}
