import { HttpRequest } from './HttpRequest';
import { Request } from 'express';

describe('HttpRequest', () => {
  it('should create of express request', () => {
    const expressRequest: Partial<Request> = {
      body: { any: 'any' },
      query: { any: 'any' },
      params: { any: 'any' },
    };
    const httpRequest = HttpRequest.ofExpress(expressRequest as Request);
    expect(httpRequest.body).toEqual(expressRequest.body);
    expect(httpRequest.query).toEqual(expressRequest.query);
    expect(httpRequest.params).toEqual(expressRequest.params);
  });
});
