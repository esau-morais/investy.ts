import { CompareStocksUseCase } from '@app/core/use-cases/CompareStocks';
import { CompareStocksViewModel } from '@app/presentation/CompareStocksViewModel';
import { Route } from '.';
import { HttpStatusCode } from '..';
import { HttpRequest } from '../HttpRequest';
import { HttpResponse, HttpResponseUtils } from '../HttpResponse';

export class CompareStocksRoute implements Route<CompareStocksViewModel> {
  constructor(private compareStocksUseCase: CompareStocksUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<CompareStocksViewModel>> {
    try {
      const stocksToCompare = httpRequest.query.stocksToCompare;
      const stockComparing = httpRequest.params.stockName;

      if (!stocksToCompare || stocksToCompare.length === 0) throw new InvalidStocksToCompareError();

      const result = await this.compareStocksUseCase.execute({
        stockNamesToCompare: stocksToCompare,
        stockNameComparing: stockComparing,
      });
      return { statusCode: HttpStatusCode.Ok, body: new CompareStocksViewModel(result) };
    } catch (error) {
      return HttpResponseUtils.createErrorResponse(error);
    }
  }
}

export class InvalidStocksToCompareError extends Error {
  constructor() {
    super('The stocks to compare was not provided or was provided as empty array');
  }
}
