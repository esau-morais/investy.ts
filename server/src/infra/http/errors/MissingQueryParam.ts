export class MissingQueryParam extends Error {
  constructor(queryParam: string) {
    super(`Missing query param: ${queryParam}`);
  }
}
