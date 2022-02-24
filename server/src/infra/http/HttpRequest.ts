import { Request } from 'express';

export class HttpRequest<Body = any, Query = any, Params = any> {
  public body?: Body;
  public query?: Query;
  public params?: Params;

  constructor(data: { body?: Body; query?: Query; params?: Params }) {
    this.body = data.body ?? ({} as any);
    this.query = data.query ?? ({} as any);
    this.params = data.params ?? ({} as any);
  }

  static ofExpress(request: Request) {
    return new HttpRequest({
      body: request.body,
      params: request.params,
      query: request.query,
    });
  }
}
