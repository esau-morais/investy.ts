import { Stock } from '@app/core/entities/Stock';
import { GetStockCurrentPriceUseCase } from '@app/core/use-cases/GetStockCurrentPrice';
import { StockViewModel } from '@app/presentation/StockViewModel';
import { Route } from '.';
import { HttpStatusCode } from '..';
import { HttpRequest } from '../HttpRequest';
import { HttpResponse, HttpResponseUtils } from '../HttpResponse';

export class GetStockCurrentPriceRoute implements Route<StockViewModel> {
  constructor(private getStockCurrentPriceUseCase: GetStockCurrentPriceUseCase) {}

  async handle(httpRequest: HttpRequest<any, any, any>): Promise<HttpResponse<StockViewModel>> {
    try {
      const stock = await this.getStockCurrentPriceUseCase.execute({
        stockName: httpRequest.params.stockName,
      });
      return { statusCode: HttpStatusCode.Ok, body: new StockViewModel(stock) };
    } catch (error: any) {
      return HttpResponseUtils.createErrorResponse(error);
    }
  }
}
