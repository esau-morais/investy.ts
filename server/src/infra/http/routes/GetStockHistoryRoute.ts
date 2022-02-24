import { GetStockCurrentPriceUseCase } from '@app/core/use-cases/GetStockCurrentPrice';
import { GetStockHistoryUseCase } from '@app/core/use-cases/GetStockHistory';
import { StockHistoryViewModel } from '@app/presentation/StockHistoryViewModel';
import { StockViewModel } from '@app/presentation/StockViewModel';
import { Route } from '.';
import { HttpStatusCode } from '..';
import { MissingQueryParam } from '../errors/MissingQueryParam';
import { HttpRequest } from '../HttpRequest';
import { HttpResponse, HttpResponseUtils } from '../HttpResponse';

export class GetStockHistoryRoute implements Route<StockHistoryViewModel> {
  constructor(private getStockHistoryUseCase: GetStockHistoryUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<StockHistoryViewModel>> {
    try {
      const stockName = httpRequest.params.stockName;

      const { from, to } = httpRequest.query;
      if (!from) throw new MissingQueryParam('from');
      if (!to) throw new MissingQueryParam('to');

      const initialDate = new Date(from);
      const finalDate = new Date(to);

      const history = await this.getStockHistoryUseCase.execute({
        stockName,
        initialDate,
        finalDate,
      });

      return { statusCode: HttpStatusCode.Ok, body: new StockHistoryViewModel(history) };
    } catch (error) {
      return HttpResponseUtils.createErrorResponse(error);
    }
  }
}
