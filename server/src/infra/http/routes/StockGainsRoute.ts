import { GainsStocksUseCase } from '@app/core/use-cases/GainsStocks';
import { StockGainsViewModel } from '@app/presentation/StockGainsViewModel';
import { Route } from '.';
import { HttpStatusCode } from '..';
import { MissingQueryParam } from '../errors/MissingQueryParam';
import { HttpRequest } from '../HttpRequest';
import { HttpResponse, HttpResponseUtils } from '../HttpResponse';

export class StockGainsRoute implements Route {
  constructor(private stockGainsUseCase: GainsStocksUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<StockGainsViewModel>> {
    try {
      const { purchasedAt, purchasedAmount } = httpRequest.query ?? {};
      if (!purchasedAt) throw new MissingQueryParam('purchasedAt');
      if (!purchasedAmount) throw new MissingQueryParam('purchasedAmount');

      const stockGains = await this.stockGainsUseCase.execute({
        purchasedAmount: Number(purchasedAmount),
        purchasedAt: new Date(purchasedAt),
        stockName: httpRequest.params.stockName,
      });
      return { statusCode: HttpStatusCode.Ok, body: new StockGainsViewModel(stockGains) };
    } catch (error) {
      return HttpResponseUtils.createErrorResponse(error);
    }
  }
}
