import { StockNotFound } from '@app/core/errors/StockNotFound';
import { MissingParamError } from '@app/shared/errors/MissingParamError';
import { HttpStatusCode } from '.';
import { MissingQueryParam } from './errors/MissingQueryParam';
import { InvalidStocksToCompareError } from './routes/CompareStocksRoute';

type ErrorResponse = { message: string };

export type HttpResponse<Body = any> = {
  statusCode: number;
  body: Body | ErrorResponse | undefined;
};

export class HttpResponseUtils {
  static createErrorResponse(error: any): HttpResponse {
    return {
      statusCode: getStatusCodeOf(error),
      body: error?.message && { message: error.message },
    };
  }
}

function getStatusCodeOf(error: any) {
  if (error instanceof MissingParamError) return HttpStatusCode.BadRequest;
  if (error instanceof StockNotFound) return HttpStatusCode.NotFound;
  if (error instanceof MissingQueryParam) return HttpStatusCode.BadRequest;
  if (error instanceof InvalidStocksToCompareError) return HttpStatusCode.BadRequest;
  return HttpStatusCode.ServerError;
}
