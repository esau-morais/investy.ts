import { Stock } from '@app/core/entities/Stock';
import { StockNotFound } from '@app/core/errors/StockNotFound';
import { GainsStocksUseCase } from '@app/core/use-cases/GainsStocks';
import { StockHistory } from '@app/core/use-cases/GetStockHistory';
import { StockGainsViewModel } from '@app/presentation/StockGainsViewModel';
import { StockingAPI } from '@app/services/StockingAPI';
import { parseViewModel } from '@app/__tests__/helpers';
import { HttpStatusCode } from '..';
import { MissingQueryParam } from '../errors/MissingQueryParam';
import { HttpRequest } from '../HttpRequest';
import { StockGainsRoute } from './StockGainsRoute';

describe('StockGainsRoute', () => {
  it('should return model view correctly', async () => {
    const { sut, useCaseSpies } = createSut();

    useCaseSpies.execute.mockResolvedValue({
      name: 'any',
      purchasedAmount: 100,
      purchasedAt: new Date('2021-10-22'),
      priceAtDate: 142.36,
      lastPrice: 127.88,
      capitalGains: -1448.0000000000018,
    });

    const request = new HttpRequest({
      params: { stockName: 'Any' },
      query: { purchasedAt: '2021-10-22', purchasedAmount: '100' },
    });
    const response = await sut.handle(request);

    expect(useCaseSpies.execute).toHaveBeenCalledWith({
      stockName: 'Any',
      purchasedAt: new Date('2021-10-22'),
      purchasedAmount: 100,
    });
    expect(response.statusCode).toBe(HttpStatusCode.Ok);
    expect(parseViewModel(response.body as StockGainsViewModel)).toEqual({
      name: 'any',
      purchasedAmount: 100,
      purchasedAt: '2021-10-22',
      priceAtDate: 142.36,
      lastPrice: 127.88,
      capitalGains: -1448.0000000000018,
    });
  });

  it('should return 404 when stock name isn"t found', async () => {
    const { sut, useCaseSpies } = createSut();

    useCaseSpies.execute.mockRejectedValue(new StockNotFound('Any'));

    const request = new HttpRequest({
      params: { stockName: 'Any' },
      query: { purchasedAt: '2021-10-22', purchasedAmount: 100 },
    });
    const response = await sut.handle(request);

    expect(response.statusCode).toBe(HttpStatusCode.NotFound);
    expect(response.body).toEqual({
      message: new StockNotFound('Any').message,
    });
  });

  it('should returns 400 status code when some query param is missing', async () => {
    const { sut } = createSut();

    let request = new HttpRequest({
      params: { stockName: 'Any' },
      query: {},
    });
    let response = await sut.handle(request);

    expect(response.statusCode).toBe(HttpStatusCode.BadRequest);
    expect(response.body).toEqual({
      message: new MissingQueryParam('purchasedAt').message,
    });

    request = new HttpRequest({
      params: { stockName: 'Any' },
      query: { purchasedAt: '2021-10-21' },
    });
    response = await sut.handle(request);

    expect(response.statusCode).toBe(HttpStatusCode.BadRequest);
    expect(response.body).toEqual({
      message: new MissingQueryParam('purchasedAmount').message,
    });
  });
});

function createSut() {
  const stockingAPI = new FakeStockingAPI();
  const gainsStockUseCase = new GainsStocksUseCase(stockingAPI);
  const executeSpy = jest.spyOn(gainsStockUseCase, 'execute');

  const sut = new StockGainsRoute(gainsStockUseCase);

  return { sut, useCaseSpies: { execute: executeSpy } };
}

class FakeStockingAPI implements StockingAPI {
  fetchByName(name: string): Promise<Stock | null> {
    throw new Error('Method not implemented.');
  }
  fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory | null> {
    throw new Error('Method not implemented.');
  }
}
