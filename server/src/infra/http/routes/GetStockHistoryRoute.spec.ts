import { HistoryPrice } from '@app/core/entities/HistoryPrice';
import { Stock } from '@app/core/entities/Stock';
import { StockNotFound } from '@app/core/errors/StockNotFound';
import { GetStockHistoryUseCase, StockHistory } from '@app/core/use-cases/GetStockHistory';
import { ViewModel } from '@app/presentation';
import { StockHistoryViewModel } from '@app/presentation/StockHistoryViewModel';
import { StockingAPI } from '@app/services/StockingAPI';
import { MissingParamError } from '@app/shared/errors/MissingParamError';
import { parseViewModel } from '@app/__tests__/helpers';
import { HttpStatusCode } from '..';
import { MissingQueryParam } from '../errors/MissingQueryParam';
import { HttpRequest } from '../HttpRequest';
import { GetStockHistoryRoute } from './GetStockHistoryRoute';

describe('GetStockHistoryRoute', () => {
  it('should returns a stock view model when is a stock name valid', async () => {
    const { sut } = createSut();

    const request = new HttpRequest({
      params: {
        stockName: 'any',
      },
      query: {
        from: '2020-09-10',
        to: '2020-10-10',
      },
    });
    const response = await sut.handle(request);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(StockHistoryViewModel);

    const parsed = parseViewModel(response.body as ViewModel<any>);
    expect(parsed).toMatchObject({
      name: 'any',
      prices: expectedHistory(),
    });
  });

  it('should returns 404 status code when stock information isn"t found', async () => {
    const { sut, stockingAPISpies } = createSut();
    stockingAPISpies.fetchByName.mockResolvedValue(null);
    const request = new HttpRequest({
      params: {
        stockName: 'invalid',
      },
      query: {
        from: '2020-09-10',
        to: '2020-10-10',
      },
    });

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({ message: new StockNotFound('invalid').message });
  });

  it('should returns a 400 when invalid stock name is provided', async () => {
    const { sut } = createSut();
    const request = new HttpRequest({
      params: {
        stockName: ' ',
      },
      query: {
        from: '2020-09-10',
        to: '2020-10-10',
      },
    });
    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({ message: new MissingParamError('stockName').message });
  });

  it('should throws the MissingQueryParam when "to" or "from" are missing', async () => {
    const { sut } = createSut();

    let request = new HttpRequest({
      params: {
        stockName: 'any',
      },
    });
    let response = await sut.handle(request);
    expect(response.statusCode).toBe(HttpStatusCode.BadRequest);
    expect(response.body).toMatchObject({
      message: new MissingQueryParam('from').message,
    });

    request = new HttpRequest({
      params: {
        stockName: 'any',
      },
      query: {
        from: '2020-10-22',
      },
    });
    response = await sut.handle(request);
    expect(response.statusCode).toBe(HttpStatusCode.BadRequest);
    expect(response.body).toMatchObject({
      message: new MissingQueryParam('to').message,
    });
  });
});

function createSut() {
  const stockingAPI = new FakeStockingAPI();
  const getStockHistoryUseCase = new GetStockHistoryUseCase(stockingAPI);
  const sut = new GetStockHistoryRoute(getStockHistoryUseCase);

  const stockingAPISpies = {
    fetchByName: jest.spyOn(stockingAPI, 'fetchStockHistory'),
  };

  return { sut, stockingAPISpies };
}

class FakeStockingAPI implements StockingAPI {
  async fetchByName(name: string): Promise<Stock | null> {
    throw new Error('Method not implemented.');
  }
  async fetchStockHistory(name: string, initialDate: Date, finalDate: Date): Promise<StockHistory | null> {
    return {
      stockName: name,
      history: fakeHistoryData(),
    };
  }
}

function fakeHistoryData() {
  return [
    new HistoryPrice({
      closing: 100,
      opening: 80,
      high: 110,
      low: 79,
      pricedAt: new Date('2020-10-21T10:00:00.000Z'),
    }),
    new HistoryPrice({
      closing: 110,
      opening: 70,
      high: 120,
      low: 50,
      pricedAt: new Date('2020-10-22T10:00:00.000Z'),
    }),
    new HistoryPrice({
      closing: 120,
      opening: 40,
      high: 130,
      low: 80,
      pricedAt: new Date('2020-10-22T10:00:00.000Z'),
    }),
  ];
}

function expectedHistory() {
  return [
    {
      closing: 100,
      opening: 80,
      high: 110,
      low: 79,
      pricedAt: '2020-10-21',
    },
    {
      closing: 110,
      opening: 70,
      high: 120,
      low: 50,
      pricedAt: '2020-10-22',
    },
    {
      closing: 120,
      opening: 40,
      high: 130,
      low: 80,
      pricedAt: '2020-10-22',
    },
  ];
}
