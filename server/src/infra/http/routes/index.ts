import { HttpRequest } from '../HttpRequest';
import { HttpResponse } from '../HttpResponse';

export interface Route<Response = any> {
  handle(httpRequest: HttpRequest): Promise<HttpResponse<Response>>;
}
